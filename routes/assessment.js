const express = require('express');
const router = express.Router();
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const { Question, Answer, Evaluation } = require('../models');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: [
    ],
});


router.post('/generate-questions', async (req, res) => {
    const { skill, rubrics } = req.body;

    try {
        const prompt = `Generate a list of questions to assess the skill "${skill}" based on the following rubrics: ${JSON.stringify(rubrics)}`;

        const result = await chatSession.sendMessage(prompt);

        const questions = result.response.text();
        questions = questions.map(choice => choice.text.trim());

        const questionRecords = await Promise.all(questions.map(async (content) => {
            return Question.create({ skill, rubric: rubrics, content });
        }));

        res.json({ questions: questionRecords });
    } catch (error) {
        res.status(500).json({ error: 'Error generating questions' });
    }
});

router.post('/submit-answers', async (req, res) => {
    const { questionId, content } = req.body;

    try {
        const answer = await Answer.create({ questionId, content });
        res.json({ answer });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting answer' });
    }
});

router.post('/evaluate-answers', async (req, res) => {
    const { answerId } = req.body;

    try {
        const answer = await Answer.findByPk(answerId, {
            include: Question,
        });

        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }

        const prompt = `Evaluate the following answer based on the rubrics: ${JSON.stringify(answer.Question.rubric)}\n\nAnswer: ${answer.content}`;

        const result = await chatSession.sendMessage(prompt);
        const score = result.response.text();

        const evaluation = await Evaluation.create({ answerId, score });

        res.json({ evaluation });
    } catch (error) {
        res.status(500).json({ error: 'Error evaluating answer' });
    }
});

module.exports = router;
