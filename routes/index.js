const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Author page.
router.get('/author', (req, res, next) => {
  res.render('author');
});

module.exports = router;
