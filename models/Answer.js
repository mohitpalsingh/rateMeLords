module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define('Answer', {
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        evaluationId: {
            type: DataTypes.INTEGER,
        },
    });

    Answer.associate = (models) => {
        Answer.belongsTo(models.Question, { onDelete: 'CASCADE' });
        Answer.hasOne(models.Evaluation, { onDelete: 'CASCADE' });
    };

    return Answer;
};
