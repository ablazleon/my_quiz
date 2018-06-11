const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz');

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

module.exports = router;
