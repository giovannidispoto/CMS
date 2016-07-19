
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Benvenuto nel CMS', description: 'sito nato a scopo didattico' })
  res.render('login');
};
