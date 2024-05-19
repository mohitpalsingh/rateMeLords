module.exports = (sequelize, DataTypes) => {
    const Evaluation = sequelize.define('Evaluation', {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        score: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
    });

    Evaluation.associate = (models) => {
        Evaluation.belongsTo(models.Answer, { onDelete: 'CASCADE' });
    };

    return Evaluation;
};
