
// Data model

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tip',
        {
            text: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Tip must not be empty"}}
            }
        });
};