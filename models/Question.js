module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
        skill: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rubric: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });

    Question.associate = (models) => {
        Question.hasMany(models.Answer, { onDelete: 'CASCADE' });
    };

    return Question;
};
