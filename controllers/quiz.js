
// To make it visible from outer every method is an atributte of a class.
const models = require('../models');


/*
* GET /quizzes
*/
exports.index = (req, res, next) => {

    const quizzes = models.quiz.findAll();

    res.render('quizzes/index.ejs', {quizzes}) ;
    console.log("No se pilla al acceder a index");
};

/*
* GET /quizzes/:quizId(//d+)
*
* Fill the form with this certain quiz data.
*
*/
exports.show = (req, res, next) => {


    const quizId = Number(req.params.quizId);
    const quiz = models.quiz.findById(quizId);

    if(quiz){
        res.render('quizzes/show', {quiz}) ;
    }
    else{
        next(new Error('There is no quiz with id='+ quizId));
    }
};

/*
* GET /quizzes/:quizId/edit
*
* Fill the form with this certain quiz data.
*
*/
exports.edit = (req, res, next) => {


    const quizId = Number(req.params.quizId);
    const quiz = models.quiz.findById(quizId);

    if(quiz){
        res.render('quizzes/edit', {quiz}) ;
    }
    else{
        next(new Error('There is no quiz with id='+ quizId));
    }
};

/*
* PUT /quizzes/:quizId
*
* Use the form data to fill certain variables.
*
*/
exports.update = (req, res, next) => {


    const quizId = Number(req.params.quizId);
    const quiz = models.quiz.findById(quizId);

    if(quiz){
       quiz.question = req.body.question;
       quiz.answer = req.body.answer;

       models.quiz.update(quiz);

       res.redirect('/quizzes');
    }
    else{
        next(new Error('There is no quiz with id='+ quizId));
    }
};