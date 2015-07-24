
// GET author data.
exports.author = function(req, res) {
  res.render('author', { pregunta: '¿Capital de Italia?' });
};
