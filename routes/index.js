var express = require('express');
var router = express.Router();

var authorController = require('../controllers/author_controller');
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/* GET quizes page. */
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

/* GET creditos page. */
router.get('/author', authorController.author);

module.exports = router;
