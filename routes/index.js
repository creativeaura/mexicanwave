
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Mexi Waves' });
};

exports.remote = function(req, res){
  res.render('remote', {  });
};