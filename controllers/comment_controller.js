var models = require('../models/models.js');

// GET /quizes/:id/comments/new.
exports.new = function(req, res) {
  res.render('comments/new', { quizId: req.params.quizId, errors: [] });
};

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId) {
  models.Comment.find({
            where: {
                id: Number(commentId)
            }
        }).then(function(comment) {
      if (comment) {
        req.comment = comment;
        next();
      } else{next(new Error('No existe commentId=' + commentId))}
    }
  ).catch(function(error){next(error)});
};

// POST /quizes/:id/comments/create
exports.create = function(req, res) {
console.log("CREATE: 1");
  var comment = models.Comment.build(
      { texto: req.body.comment.texto,
        QuizId: req.params.quizId
        });
console.log("CREATE: 2");

  comment.validate().then(
    function(err){
      if (err) {
        res.render('comments/new', {comment: comment, errors: err.errors});
      } else {
        comment // save: guarda en DB campo texto de comment
        .save()
        .then( function(){ res.redirect('/quizes/'+req.params.quizId)})
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function(error){next(error)});

};
