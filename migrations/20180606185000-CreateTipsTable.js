'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('tips',
            {
                id: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true,
                    autoincrement: true,
                    unique: true
                },
                quizId: {
                    type: Sequelize.INTEGER
                },
                text: {
                    type: Sequelize.STRING,
                    validate: {notEmpty: {msg: "Tip must not be empty."}}
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                }
            },
            {
                sync: {force: true}
            }
        );
    },

    down(queryInterface, Sequelize) {
        return queryInterface.dropTable('tips');
    }
};