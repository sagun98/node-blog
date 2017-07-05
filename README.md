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

//Requiring necessary modules
```bash
var session = require ('express-session');
var multer = require ('multer');
var moment = require ('moment');
var expressValidator = require ('express-validation');

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