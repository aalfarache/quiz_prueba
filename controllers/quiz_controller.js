var models = require('../models/models.js');

// GET quizes question.
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
      where: { id: Number(quizId) },
      include: [{ model: models.Comment}]
  }).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error("No existe quizId=" + quizId));
      }
    }
  ).catch(
    function(error) {
      next(error);
    }
  );
};

// GET quizes question.
var lastSearch = '';  // guarda la última búsqueda realizada
exports.index = function(req, res) {
  if (req.query.initSearch==='y') {
    lastSearch = '';
  }
  lastSearch = req.query.search||lastSearch;
  var search = lastSearch.trim().replace(/ +/g, '%');   // componemos la cadena SQL de bùsquea

  models.Quiz.findAll(
    { where: ["pregunta like ? or respuesta like ?", '%'+search+'%', '%'+search+'%'] ,
      order: ["pregunta"]
    }
  ).then(
    function(quizes) {
      res.render('quizes/index', { quizes: quizes, search: lastSearch, errors: [] });
    }
  ).catch(
    function(error) {
      next(error);
    }
  );

};

// GET /quizes/:quizId.
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: [] });
};

// GET /quizes/:quizId/answer.
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: [] });
};

// GET /quizes/new.
exports.new = function(req, res) {
  var quiz = models.Quiz.build( // crea un objeto Quiz
    { pregunta: "pregunta", respuesta: "respuesta", tema: "otro" }
  );

  res.render('quizes/new', { quiz: quiz, errors: [] });
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  quiz.validate().then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(
          function(){ res.redirect('/quizes')}
        );
      }
    }
  );
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;  // autoload de instancia de quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz.validate().then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(
          function(){ res.redirect('/quizes')}
        );
      }
    }
  );
};

// DELETE /quizes/:quizId
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
