const express = require('express');
const router = express.Router();

const quizController = require('../controllers/quiz');
const tipController = require('../controllers/tip');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Author page.
router.get('/author', (req, res, next) => {
  res.render('author');
});

// Autoload for routes, using :quizId

router.param('quizId',                    quizController.load);

// Quizzes
router.get('/quizzes',                    quizController.index);
router.get('/quizzes/:quizId(\\d+)',      quizController.show);
router.get('/quizzes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizzes/:quizId(\\d+)',      quizController.update);
router.get('/quizzes/new',                quizController.new);
router.put('/quizzes/create',             quizController.create);
router.delete('/quizzes/:quizId(\\d+)',   quizController.destroy);
router.get('/quizzes/:quizId(\\d+)/play', quizController.play);
router.get('/quizzes/:quizId(\\d+)/check',quizController.check)
router.post('/quizzes/:quizId(\\d+)/tips',     tipController.create);

module.exports = router;
