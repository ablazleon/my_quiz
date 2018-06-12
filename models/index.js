
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

// Relation 1-N quiz and tips

const {quiz, tip} = sequelize.models;

tip.belongsTo(quiz);
quiz.hasMany(tip);

module.exports = sequelize;
