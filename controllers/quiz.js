
// To make it visible from outer every method is an atributte of a class.
const models = require('../models');

// Autoload of the quiz associated with :quizId anytime this appear
exports.load = (req, res, next, quizId) => {

    const quiz = models.quiz.findById(Number(quizId));

    if (quiz){
        req.quiz = quiz;
        next();
    } else {
        next(new Error( "There is no quiz with this id " + quizId));
    }
}

/*
* GET /quizzes
*/
exports.index = (req, res, next) => {

    const quizzes = models.quiz.findAll();

    res.render('quizzes/index.ejs', {quizzes}) ;

};

/*
* GET /quizzes/:quizId(//d+)
*
* Fill the form with this certain quiz data.
*
*/
exports.show = (req, res, next) => {

    const {quiz} = req;
    res.render('quizzes/show', {quiz}) ;
};

/*
* GET /quizzes/:quizId/edit
*
* Fill the form with this certain quiz data.
*
*/
exports.edit = (req, res, next) => {

    const {quiz} = req;
    res.render('quizzes/edit', {quiz}) ;
};

/*
* PUT /quizzes/:quizId
*
* Use the form data to fill certain variables.
*
*/
exports.update = (req, res, next) => {

    const {quiz} = req;

    if(quiz){
       quiz.question = req.body.question;
       quiz.answer = req.body.answer;

       models.quiz.update(quiz);

       res.redirect('/quizzes');
    }
};