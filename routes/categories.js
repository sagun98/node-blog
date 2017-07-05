var express = require('express');
var router = express.Router(); 
var mongo = require('mongodb');
var db = require ('monk')('localhost/nodeblog');


/* GET users listing. */
router.get('/add', function(req, res,next) {
  	res.render('addcategory',{
  	'title':'Add Category'
  });
});


router.post('/add',upload.single('mainimage'),function(req, res,next) {
  // Get Form Values
  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();
 
 //Check image upload 
  if (req.file){
  	var mainimage = req.file.filename;
  }
  else{
  	var mainimage = 'noimage.jpg';
  }

  //Form Validation:
   req.checkBody('title','Title field is required').notEmpty();
   req.checkBody('body','Body field is required').notEmpty();

   //Check errors
   var errors = req.validationErrors();
   if (errors){
   	res.render('addpost',{
   		"errors":errors
   	});
   }
   else {
   	var posts = db.get('posts');
   	posts.insert({
   		"title":title,
   		"body":body,
   		"category":category,
   		"date":date,
   		"author":author,
   		"mainimage":mainimage
   	},function(err,post){
   		if(err){
   			res.send(err);
   		}
   		else {
   			req.flash('success','Post Added');
   			res.location('/');
   			res.redirect('/');
   		}
   	});
   }
});


module.exports = router;
