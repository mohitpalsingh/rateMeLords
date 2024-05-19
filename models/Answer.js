module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define('Answer', {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    });

    Answer.associate = (models) => {
        Answer.belongsTo(models.Question, { onDelete: 'CASCADE' });
        Answer.hasOne(models.Evaluation, { onDelete: 'CASCADE' });
    };

    return Answer;
};
