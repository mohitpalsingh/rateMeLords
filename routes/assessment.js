const express = require('express');
const router = express.Router();
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const { v4 } = require('uuid');
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
    const userId = v4();
    const { skill, rubrics } = req.body;

    try {
        const prompt = `Generate a list of 10 questions to assess the skill "${skill}" based on the following rubrics: ${JSON.stringify(rubrics)}. Write nothing but questions with number in front of them separated by "\n\n".`;

        const result = await chatSession.sendMessage(prompt);

        const questions = result.response.text();

        const parsedQuestions = questions.split("\n");

        const questionRecords = await Promise.all(parsedQuestions.map(async (content) => {
            const newQuestion = new Question({ userId, skill, content });
            return await newQuestion.save();
        }));

        res.json({ questions: questionRecords });
    } catch (error) {
        res.status(500).json({ error: 'Error generating questions' });
    }
});

router.post('/submit-answers', async (req, res) => {
    const { userId, answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Invalid request format. Please provide an array of answers.' });
    }

    try {
        const answerPromises = answers.map(async (answer) => {
            return await Answer.create({
                userId,
                questionId: answer.questionId,
                content: answer.content,
            });
        });

        const createdAnswers = await Promise.all(answerPromises);

        res.json({ message: 'Answers submitted successfully!', answers: createdAnswers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error submitting answers' });
    }
});

router.post('/evaluate-answers', async (req, res) => {
    const { userId, answers, rubrics } = req.body;

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Invalid request format. Please provide an array of answers.' });
    }

    try {
        let message = '';
        for (const answerObj of answers) {
            const { questionId, answerId } = answerObj;

            const answer = await Answer.findByPk(answerId).catch(() => null);
            const question = await Question.findByPk(questionId).catch(() => null);

            if (!answer || !question) {
                continue;
            }

            const questionString = question.content;
            const answerString = answer.content;

            message += `\n\n**Question:** ${questionString}\n\nAnswer: ${answerString}\n\n`;
        }

        message = `Evaluate the following answers from a candidate and based on the rubrics: ${JSON.stringify(rubrics)}\n\n${message}. Give me a one word final rubric for this candidate.`;

        const result = await chatSession.sendMessage(message);
        const score = result.response.text();

        const evaluation = await Evaluation.create({ userId, score });

        res.json({ evaluation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error evaluating answers' });
    }
});

module.exports = router;
