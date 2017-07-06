## Notes:  
#### Starting the NODE BLOG SYSTEM  

#### Necessary modules:
```bash  
sudo npm -g install express  
sudo npm -g install express-generator  
```  

### Go to the project folder and run 'express blog'  

### Dependencies needed to install in the package.json:  
```bash
body-parser  
cookie-parser  
debug  
express  
jade  
morgan  
serve-favicon  
```
#### Not in the package.json  
```bash
mongodb  
monk (ORM Like mongoose)  
connect-flash  
express-messages  
express-validator  
express-session  
multer (helps in file upload)  
moment  
```
#### Package.json
```bash
 "dependencies": {
    "express": "~4.0.0",
    "static-favicon": "~1.0.0",
    "morgan": "~1.0.0",
    "cookie-parser": "~1.0.1",
    "body-parser": "~1.0.0",
    "debug": "~0.7.4",
    "jade": "~1.3.0",
    "monk":"^1.0.1",
    "monk":"https://github.com/vccabral/monk.git",
    "connect-flash":"*",
    "express-validator":"*",
    "express-session":"*",
    "express-messages":"*",
    "multer":"*",
    "moment":"*",
    "mongodb":"*"
  }
  ```  

### Requiring necessary modules
```bash
var session = require ('express-session');
var multer = require ('multer');
var mongo = require('mongodb');
var expressValidator = require ('express-validator');
var db = require ('monk')('localhost/nodeblog');


//Making locals global
app.locals.moment=require ('moment');


// Make db accesible to our router (Middleware)
app.use(function(req,res,next){
	req.db = db;
	next();
});
```

#### Middleware for connect-flash:  
```bash
//Express messages (Download this middleware from github 'Express messages')
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
```
#### Middleware for express-validator:  
```bash
//Express Validator (Download this middleware form github 'expressValidator middleware')
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
```
#### Middleware for EXPRESS-SESSIONS:
```bash
app.use(session({  
	secret:'secret',  
	saveUninitialized: true,  
	resave: true  
}));
```  
#### Middleware for Multer
```bash
var upload = multer({dest:'./uploads'});  
```
  


## Views and Layouts:
**JADE**  
  ```bash
doctype html
html
  head
    title =title
    link(rel='stylesheet', type='text/css', href='/stylesheets/style.css')
  body
    .container
      image(src='images/node.png' style="margin-left:0px;height:50px;width:50px;")
      image(src='images/nodejs.png' style="margin-left: 225px;")
        nav
          ul
            li
              a(href='/') Home
            li
              a(href='/posts/add') Add Post
            li
              a(href='categories/add') Add Category
       block content
      footer
        p NodeBlog &copy; 2017
  ```  

  
  
## HOMEPAGE POST DISPLAY  
[] Go to mongo db prompt and create new db
```bash
  use nodeblog
  db.createCollection('categories');
  db.createCollection('posts');
```  

#### Example for inserting a POST:
```bash
db.posts.insert({title:'Blog POst One',category:"Technology",author:"Sagun Maharjan",body:"This is a body",date:ISODate()});

db.posts.find().pretty();

```

### Routes/index.js
require necessary module  
```bash
var mongo = require ('mongodb');
var db = require ('monk')('localhost/nodeblog');
```

#### Get route for routes/index.js
```bash
/*update default route to:*/
router.get('/', function(req, res,next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({},{},function(err,posts){
    res.render('index', { posts: posts });
  });
});
```

#### View for index.jade
```bash
extends layout

block content
  if posts
    each post, i in posts
      .post
        h1
          a(href='/posts/show/#{post._id}')
            =post.title
        p.meta Posted in #{post.category} by #{post.author} on #{moment(post.date).format("MM-DD-YYYY")}
        =post.body
        a.more(href='/posts/show/#{post._id}') Read More
```
  

### GET and POST Routing for POSTS   

#### In app.js  
```bash
//Change var users = require('./routes/users'); to :
var posts = require('./routes/posts');

//Change app.use('/users', users); to :
app.use('/posts', posts);
```

#### In routes/posts.js    
```bash
router.get('/add', function(req, res,next) {
  res.render('addpost',{
    'title':'Add Post'
  });
});
```
  

#### Create view/addpost.jade

```bash
extends layout

block content
  h1= title
  ul.errors
    if errors
      each error, i in errors
        div.alert.alert-danger #{error.msg}
  form(method='post',action='/posts/add',enctype='multipart/form-data')
    .form-group
      label Title
      input.form-control(name='title',type='text')
    .form-group
      label Category
      select.form-control(name='category')
    .form-group
      label Body
      textarea.form-control(name='body',id='body')
    .form-group
      label Main Image:
      input.form-control(name='mainimage',type='file')
    .form-group
      label Author
      select.form-control(name='author')
        option(value='Sagun Maharjan') Sagun Maharjan
        option(value='Sam') Sam
    input.btn.btn-default(type='submit',name='submit',value='Submit')
```  


#### POST routing for routes/posts.js:  
  
#### First include in route/posts.js:
```bash
var multer = require ('multer');
var upload = multer({dest:'./uploads'}); 
var mongo = require('mongodb');
var db = require ('monk')('localhost/nodeblog');

``` 

#### Then below
```bash
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

});
```  
  
  
  ### To show the categories of database in the dropdown  
  #### Now create some categories in MONGODB to test:
  ```bash
    db.categories.insert({name:'Business'});
    db.categories.insert({name:'Science'});
    db.categories.insert({name:'Technology'});
 ```
  
  
 #### Now update GET request of routes/posts.js to :
  ```bash
  /* GET users listing. */
router.get('/add', function(req, res,next) {
  var categories = db.get('categories');
  
  categories.find({},{},function(err,categories){
    res.render('addpost',{
    'title':'Add Post',
    'categories':categories
  });
  });
});
```
  
 #### Update the views/addpost.jade
  ```bash
    .form-group
      label Category
      select.form-control(name='category')
        each category, i in categories
          option(value='#{category.name}') #{category.name}
  ```
  

## Text Editor and Add Categories:  
  
### First setting up the CKEditor:  
- Go to `http://ckeditor.com/download`   and choose `Standard package`.
- Unzip the package and put it inside nodeblog/public folder

#### Write a script in addpost.jade to include the editor
```bash
script(src='/ckeditor/ckeditor.js')
script
  CKEDITOR.replace('body');
```
  

## Add Category Page (routes/categories.js)  
- #### Copy the routes/post.js file content to routes/categories.js
- #### Change the things that needs to be changed like GET routes for the categories: 
```bash
//routes/categories.js

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


module.exports = router;

```
- #### Make a view of addcategory.jade
```bash
extends layout

block content
  h1=title
  ul.errors
    if errors
      each error,i in errors
        li.alert.alert-danger #{error.msg}
  form(method='post',action='/categories/add')
    .form-group
      label Name:
      input.form-control(name='name',type='text')
    input.btn.btn-default(type='submit',name='submit',value='Save')
```

- #### Add the routes in app.js:
```bash
  var categories = require('./routes/categories');

  app.use('/categories', categories);
```
- #### Add the POST routes in routes/categories.js:  
```bash

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
```
- #### Add `!=messages()` in layout.jade and style css:
```bash

```  
  
  
## Truncate Text and Categories View:
- #### Remove all the posts first `db.posts.remove({});` in mongodb
- In `index.jade` replace `!=post.body`   => to parse the HTML into the blog  
  and finally to `!=truncateText(post.body,400)`  => to truncate the text
- In app.js add:
```bash
app.locals.truncateText = function(text,length){
  var truncatedText = text.substring(0,length);
  return truncatedText;
}
```
- Change the file location in routes/posts.js
```bash
var upload = multer({dest:'./public/images'}); 
```
- Add the image tag line in `index.jade`
```bash
        img(src='/images/#{post.mainimage}')
        !=truncateText(post.body,400)
```

### Adding a GET route to "show individual" in routes/categories.js

- #### GET route for individual posts
```bash
// Show route
router.get('/show/:category', function(req, res,next) {
  var posts = db.get('posts');
  posts.find({category:req.params.category},{},function(err,posts){
    res.render('index',{
    'title':req.params.category,
    'posts':posts
  });
  });
});
```
- #### Change the index.jade to add the link to open individual posts:
```bash
  p.meta Posted in 
          a(href='/categories/show/#{post.category}') #{post.category} 
          by #{post.author} 
          on #{moment(post.date).format("MM-DD-YYYY")}
        img(src='/images/#{post.mainimage}')
        !=truncateText(post.body,400)
        a.more(href='/posts/show/#{post._id}') Read More
```
  

## Read More Single POST and COMMENT functionality: 
- #### In routes/post.js , create a GET route for a single page READMORE
```bash
router.get('/show/:id', function(req, res,next) {
  var posts = db.get('posts');
  
  posts.findById(req.params.id,function(err,post){
    res.render('show',{
    'post':post
    });
  });
});
```
 
- Then create a new view file show.jade:
```bash
extends layout

block content
      .post
        h1
        p.meta Posted in 
          a(href='/categories/show/#{post.category}') #{post.category} 
          by #{post.author} 
          on #{moment(post.date).format("MM-DD-YYYY")}
        img(src='/images/#{post.mainimage}')
        !=post.body
        br
        hr
        if post.comments
          h3 Comments
          each comment, i in post.comments
            .comment
              p.comment-name #{comment.name}
              p.comment-body #{comment.body}
            br
          h3 Add Comment
          if errors
            ul.errors
              each error, i in errors
                li.alert.alert-danger #{error.msg}
      form.comment-form(method='post',action='/posts/addcomment')
        input(name='postid',type='hidden',value='#{post._id}')
        .form-group
        label Name
        input.form-control(type='text',name='name')
        .form-group
        label Email
        input.form-control(type='text',name='email')
        .form-group
        label Body
        input.form-control(type='text',name='body')
      br
      input.btn.btn-default(type='submit',name='submit',value='Add Comment')
```

### POST route for Comments section(/posts/addcomment):
- #### Goto routes/post.js and copy the POST route as follows:
```bash
router.post('/addcomment',function(req, res,next) {
  // Get Form Values
  var name = req.body.name;
  var email = req.body.email;
  var body = req.body.body;
  var postid = req.body.postid;
  var commentdate = new Date();

  //Form Validation:
   req.checkBody('name','Name field is required').notEmpty();
   req.checkBody('email','Email field is required but never displayed').notEmpty();
   req.checkBody('email','Email is not formatted properly.').isEmail();
   req.checkBody('body','Body field is required').notEmpty();

   //Check errors
   var errors = req.validationErrors();
   if (errors){
    var posts = db.get('posts');
    posts.findById(postid,function(err,post){
      res.render('addpost',{
      "errors":errors
      });
    });
   }
   else {
    var comment = {
      "name": name,
      "email":email,
      "body":body,
      "commentdate":commentdate
    }

    var posts = db.get('posts');
    posts.update({
      "_id":postid
    },{
      $push:{
        "comments":comment
      }
    },function(err,doc){
      if(err){
        res.send(err);
      }
      else{
        req.flash('success',"Comment Added");
        res.location('/posts/show/'+postid);
        res.redirect('/posts/show/'+postid);
      }
    });
   }
});
```
