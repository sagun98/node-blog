var express = require('express');
var router = express.Router(); 
var mongo = require('mongodb');
var db = require ('monk')('localhost/nodeblog');



/* GET request for the categories. */
router.get('/show/:category', function(req, res,next) {
  var posts = db.get('posts');
  posts.find({category:req.params.category},{},function(err,posts){
    res.render('index',{
    'title':req.params.category,
    'posts':posts
  });
  });
});


/* GET users listing. */
router.get('/add', function(req, res,next) {
  	res.render('addcategory',{
  	'title':'Add Category'
  });
});


router.post('/add',function(req, res,next) {
  // Get Form Values
  var name = req.body.name;
 
  //Form Validation:
   req.checkBody('name','Title field is required').notEmpty();

   //Check errors
   var errors = req.validationErrors();
   if (errors){
   	res.render('addcategories',{
   		"errors":errors
   	});
   }
   else {
   	var posts = db.get('categories');
   	posts.insert({
   		"name":name
   		},function(err,post){
   		if(err){
   			res.send(err);
   		}
   		else {
   			req.flash('success','Category Added');
   			res.location('/');
   			res.redirect('/');
   		}
   	});
   }
});


module.exports = router;
