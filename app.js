
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , swig = require('swig')
  , User = require('./my_modules/User.js')
  , expressSession = require('express-session')
  , cookieParser = require('cookie-parser')
  , Cookies = require('cookies')
  , Articles = require('./my_modules/Articles');

var app = module.exports = express.createServer();




// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(cookieParser());
  app.use(expressSession({secret: "mementoauderesemprer"}));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/',function(req,res){
  res.writeHead(200, {'Content-type': 'text/html'});
  res.write(swig.renderFile('views/index.html',{ title: "Benvenuto", description: "CMS nato a scopo educativo"}));
  res.end();
});

app.post('/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    var cookies = new Cookies(req, res, {"keys": "keys"});

    var user = new User();

    user.auth(username,password, function(auth, username){
      if(auth){
        cookies.set("user", username);
        res.redirect('/home');
      }
    });
});

app.get('/login', function(req,res){
    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(swig.renderFile('views/login.html'));
    res.end();
});

app.get('/home', function(req,res){
  var cookies = new Cookies(req, res, {"keys": "keys"});
  var username = cookies.get("user");
  console.log("Cookies: ", username);
  res.writeHead(200, {'Content-type': 'text/html'});
  res.write(swig.renderFile('views/index.html', { title: "Benvenuto", description: "CMS nato a scopo educativo"}));
  res.end();
});

app.get('/signup', function(req,res){
  if(req.body.signup == undefined){
    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(swig.renderFile('views/signup.html'));
    res.end();
  }else{

  }
});

// Articoli

app.get('/articles', function(req,res){
    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(swig.renderFile("views/articles.html", { title : "pippo", articles: [{title:"pippo", description: "pippo"}, {title:"pippo", description: "pippo"}] }));
    res.end();
});

app.post('/articles', function(req,res){
    var title = req.body.title;
    var description  = req.body.description;


    var user = (new Cookie().get('user'));

    var articles = new Articles();
    article.create(user, title, description);

});

app.get('/articles/new', function(req,res){
    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(swig.renderFile('views/articles_new.html'));
    res.end();
});

// end articoli


app.get('/contact', function(req,res){
    res.writeHead(200, {'Content-type': 'text/html'});
    res.end("contact");
});

app.get('/admin', function(req,res){
    var cookies = new Cookies();

    if(cookies.get("user")){
      res.writeHead(200, {'Content-type':'text/html'});
      res.write(swig.renderFile("views/admin_panel.html", {user: cookies.get("user")}));
      res.end();
    }
});



app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
