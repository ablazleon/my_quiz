
const path = require('path');

// Load ORM

const Sequelize = require('sequelize');

// const sequelize = new Sequelize("sqlite:quiz.sqlite");

const url = process.env.DATABASE_URL || "sqlite:quiz.sqlite";

const sequelize = new Sequelize(url);

// Import the definition of Quiz Table from quiz.js
sequelize.import(path.join(__dirname, 'quiz'));

// Import the definition of Quiz Table from quiz.js
sequelize.import(path.join(__dirname,'tip'));


// Import the definition of the Users Table from user.js
sequelize.import(path.join(__dirname,'user'));

// Session
sequelize.import(path.join(__dirname, 'session'));



// Relation between models

const {quiz, tip, user} = sequelize.models;

// Relation 1-N quiz and tips
tip.belongsTo(quiz);
quiz.hasMany(tip);

// Relation 1-to-N between User and Quiz:
user.hasMany(quiz, {foreignKey: 'authorId'});
quiz.belongsTo(user, {as: 'author', foreignKey: 'authorId'});



module.exports = sequelize;
