
// To make it visible from outer every method is an atributte of a class.

const Sequelize = require("sequelize");
const {models} = require('../models');

/*
* If exists quiz it stores it in req.quiz.
* */
exports.load = (req, res, next, quizId) => {

   models.quiz.findById(quizId)
   .then(quiz => {
       if(quiz){
           req.quiz = quiz;
           next();
       } else{
           throw new Error('There is no quiz with id = ' + quizId);
       }
    })
    .catch (error => next(error));
}

/*
* GET /quizzes
*/
exports.index = (req, res, next) => {

    models.quiz.findAll()
    .then(quizzes => {
        res.render('quizzes/index.ejs', {quizzes});
    })
    .catch ( error => next(error));
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

    const {quiz, body } = req;

    quiz.question = body.question;
    quiz.answer = body.answer;

    quiz.save({fields: ["question", "answer"]})
    .then(quiz => res.redirect( '/quizzes/' + quiz.id))
        .catch(Sequelize.ValidationError, error => {
            console.log('There are errors in the form:');
            error.errors.forEach(({message}) => console.log(message));
            res.render('quizzes/edit', {quiz});
        })
        .catch(error => next(error));
    };

/*
* GET /quizzes/new
*
* Use the form data to fill certain variables.
*
*/
exports.new = (req, res, next) => {

   // res.redirect('quizzes/new');
    const quiz = {
        question: "",
        answer: ""
    };

    res.render('quizzes/new', {quiz})

};

/*
* PUT /quizzes/:quizId
*
* It is added the new object in the DDBB.
* First it saved the value form the req, then save into the BBDD
*
*/
exports.create = (req, res, next) => {

    const {question, answer} = req.body;

    const quiz = models.quiz.build({
        question,
        answer
    });

    // It is save only the wanted fields.

    quiz.save({fields: ["question", "answer"]})
    .then(quiz => res.redirect('/quizzes/' + quiz.id))
        .catch(Sequelize.ValidationError, error => {
            console.log(' There are errors in the form: ');
            error.errors.forEach(({message}) => console.log(message));
            res.render('quizzes/new', {quiz});
        })
    .catch(error => next(error));
};


/*
* DELETE /quizzes/:quizId
*
* It is destroy the object.
*
*/
exports.destroy = (req, res, next) => {

    req.quiz.destroy()
   .then(() => res.redirect('/quizzes'))
   .catch(error => next(error));
};

    // const {quiz} = req;
    //
    // models.quiz.destroy(quiz.id)
    //     .then(quiz => res.redirect('/quizzes/' + quiz.id))
    //     .catch(Sequelize.ValdiationError, error => {
    //         console.log(' There are errors in the form: ');
    //         error.errors.forEach(({message}) => console.log(message));
    //         res.render('quizzes')
    //     })
    //     .catch(error => next(error));

/*
* GET /quizzes/:quizId/play
*
* It is sent the play form.
*
*/
exports.play = (req, res, next) => {

   const {quiz, query} = req;
   const answer = query.answer || "";
   res.render('quizzes/play', {
       quiz,
       answer
   });

};

/*
* GET /quizzes/:quizId/check
*
* It is sent the play to fill in the result
*
*/
exports.check = (req, res, next) => {

    const {quiz, query} = req;
    const answer = query.answer || "";
    const result = answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim() ;
    res.render('quizzes/result', {
        quiz,
        result,
        answer
    });

};