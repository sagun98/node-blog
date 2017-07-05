## Notes:  
#### Starting the NODE BLOG SYSTEM  

Necessary modules:  
sudo npm -g install express  
sudo npm -g install express-generator  

Go to the project folder and run 'express blog'  

Dependencies needed to install in the package.json:  
```bash
body-parser  
cookie-parser  
debug  
express  
jade  
morgan  
serve-favicon  
```
Not in the package.json  
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
Package.json
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
var moment = require ('moment');
var expressValidator = require ('express-validator');

var db = require ('monk')('localhost/nodeblog');

// Make db accesible to our router (Middleware)
app.use(function(req,res,next){
	req.db = db;
	next();
});
```

Middleware for connect-flash:  
```bash
//Express messages (Download this middleware from github 'Express messages')
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
```
Middleware for express-validator:  
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
Middleware for EXPRESS-SESSIONS:
```bash
app.use(session({  
	secret:'secret',  
	saveUninitialized: true,  
	resave: true  
}));
```
Middleware for Multer
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
**CSS**  
```bash
body {
  padding: 50px;
  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
  background: #f4f4f4;
  color: #666;
}

a {
  color: #00B7FF;
}

.logo {
  text-align: center;
  margin:auto;
  display: block;
}

.container{
  width:750px;
  border: 1px solid #ccc;
  margin: 20px auto;
  padding:20px;
  border-top: #83cd39 3px solid;
}

.clr{
  clear:both;
}

ul{
  padding:0;
  margin:0;
}

h1,h2,h3,p{
  padding: 5px 0;
  margin-bottom:0;
}

p{
  margin:0;
}

nav{
  background: #404137;
  color:#fff;
  overflow: auto;
  height: 40px;
  padding: 20px 0 0 10px;
  font-size: 18px;
}

nav li {
  float:left;
  list-style:none;
}

nav a {
  padding :10px;
  margin: 0 10px;
  color: #fff;
  text-decoration: none;
}

nav a.current, nav a:hover{
  background:#83cd29;
  color:#000;
}
```  