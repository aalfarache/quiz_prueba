var express = require('express');
var router = express.Router();

var authorController = require('../controllers/author_controller');
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

router.param('quizId', quizController.load); //autoload :quizId

/* GET quizes page. */
router.get('/quizes',                       quizController.index);
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);
router.get('/quizes/new',                   quizController.new);
router.post('/quizes/create',                quizController.create);

/* GET creditos page. */
router.get('/author', authorController.author);

module.exports = router;
