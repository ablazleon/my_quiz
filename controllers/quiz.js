
// To make it visible from outer every method is an atributte of a class.

const Sequelize = require("sequelize");
const {models} = require('../models');

const paginate = require('../helpers/paginate').paginate;

/*
* If exists quiz it stores it in req.quiz.
* */
exports.load = (req, res, next, quizId) => {

    models.quiz.findById(quizId, {
        include: [
            models.tip,
            {model: models.user, as: 'author'}
        ]
    })
        .then(quiz => {
            if (quiz) {
                req.quiz = quiz;
                next();
            } else {
                throw new Error('There is no quiz with id=' + quizId);
            }
        })
        .catch(error => next(error));
};

// MW that allows actions only if the user logged in is admin or is the author of the quiz.
exports.adminOrAuthorRequired = (req, res, next) => {

    const isAdmin  = !!req.session.user.isAdmin;
    const isAuthor = req.quiz.authorId === req.session.user.id;

    if (isAdmin || isAuthor) {
        next();
    } else {
        console.log('Prohibited operation: The logged in user is not the author of the quiz, nor an administrator.');
        res.send(403);
    }
};


/*
* GET /quizzes
*/
exports.index = (req, res, next) => {

    let countOptions = {
    where: {}
    };

    let title = "Questions";
    /*
    * Search: take the req.query and put the quizzes with the desired
     */
    const search = req.query.search || '';

    if (search){
        // It is stored in local.search the treated value
        const search_like = "%" + search.replace(/ +/g, "%") + "%";

        countOptions.where = {question: { [Sequelize.Op.like]: search_like }};
    }

    // If there exists "req.user", then only the quizzes of that user are shown
    if (req.user) {
        countOptions.where.authorId = req.user.id;
        title = "Questions of " + req.user.username;
    }

    models.quiz.count(countOptions)
        .then(count => {

            // Pagination:

            const items_per_page = 10;

            // The page to show is given in the query
            const pageno = parseInt(req.query.pageno) || 1;

            // Create a String with the HTMl used to render the pagination buttons.
            // This String is added to a local variable of res, which is used into the application layout file.
            res.locals.paginate_control = paginate(count, items_per_page, pageno, req.url);

            const findOptions = {
                ...countOptions,
                offset: items_per_page * (pageno - 1),
                limit: items_per_page,
                include: [{model: models.user, as: 'author'}]
            };

            return models.quiz.findAll(findOptions);
        })
        .then(quizzes => {
            res.render('quizzes/index.ejs', {
                quizzes,
                search,
                title
            });
        })
        .catch(error => next(error));
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
    .then(quiz => {
        req.flash("success", "The quiz was edited successfully.")
        res.redirect( '/quizzes/' + quiz.id)
    })
    .catch(Sequelize.ValidationError, error => {
        req.flash('error', 'There are errors in the form:');
        error.errors.forEach(({message}) => req.flash('error', message));
        res.render('quizzes/edit', {quiz});
    })
    .catch(error => {
        req.flash('error', 'Error editing the Quiz: ' + error.message)
        next(error)
    });
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
* POST /quizzes/create
*
* It is added the new object in the DDBB.
* First it saved the value form the req, then save into the BBDD
*
*/
exports.create = (req, res, next) => {

    const {question, answer} = req.body;

    const authorId = req.session.user && req.session.user.id || 0;

    const quiz = models.quiz.build({
        question,
        answer,
        authorId
    });

    // Saves only the fields question and answer into the DDBB
    quiz.save({fields: ["question", "answer", "authorId"]})
        .then(quiz => {
            req.flash('success', 'Quiz created successfully.');
            res.redirect('/quizzes/' + quiz.id);
        })
        .catch(Sequelize.ValidationError, error => {
            req.flash('error', 'There are errors in the form:');
            error.errors.forEach(({message}) => req.flash('error', message));
            res.render('quizzes/new', {quiz});
        })
        .catch(error => {
            req.flash('error', 'Error creating a new Quiz: ' + error.message);
            next(error);
        });
};

/*
* DELETE /quizzes/:quizId
*
* It is destroy the object.
*
*/
exports.destroy = (req, res, next) => {

    req.quiz.destroy()
   .then(() =>{
       req.flash('success', 'Quiz deleted successfully')
       res.redirect('/goback')
   })
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