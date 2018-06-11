
const path = require('path');

// Load ORM

const Sequelize = require('sequelize');

// const sequelize = new Sequelize("sqlite:quiz.sqlite");

const url = process.env.DATABASE_URL || "sqlite:quiz.sqlite";

const sequelize = new Sequelize(url);

// Import the definition of Quiz Table from quiz.js
sequelize.import(path.join(__dirname, 'quiz'));

// Session
sequelize.import(path.join(__dirname, 'session'));

// Create tables

sequelize.sync()
    .then(() => console.log('Data Bases created successfully'))
    .catch(error => {
        console.log("Error creating the data base tables", error);
        process.exit(1);
    });

module.exports = sequelize;
