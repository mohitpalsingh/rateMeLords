module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        skill: {
            type: DataTypes.STRING,
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
