
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

app.post('/articles', function(req,res){
    var title = req.body.title;
    var description  = req.body.description;

    var user = (new Cookies(req,res, {keys:"keys"}).get('user'));

    var articles = new Articles();
    articles.create(user, title, description);
    res.redirect('/admin');
});

app.get('/articles', function(req,res){
    res.writeHead(200, {'Content-type': 'text/html'});
    var articles = new Articles();
    var cookies = new Cookies(req,res, {keys:"keys"});
    var values;
    articles.read(null, function(data){

      var arr = [];
      for(i = 0; i < data.length; i++){
        var output = [];
        output['title'] = data[i].title;
        output['description'] = data[i].description;
        output['username'] = data[i].fk_user;
        output['id'] = data[i].id;
        arr[i] = output;
      }
        console.log(arr);
        var logged = cookies.get("user");
      res.write(swig.renderFile('views/articles.html',{logged: (logged != undefined)?true:false, articles: arr }));
    });

});

app.get('/articles/:art_id', function(req,res){
    var articles = new Articles();
    var id = req.params.art_id;
    var article = articles.read(id);
    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(swig.renderFile("views/article.html"), {title: article.title, description: article.description, user: article.user });

});

app.put('/articles/:art_id', function(req,res){

});

app.delete('/articles/:art_id', function(req,res){

});
// end articoli


app.get('/contact', function(req,res){
    res.writeHead(200, {'Content-type': 'text/html'});
    res.end("contact");
});

app.get('/admin', function(req,res){
    var cookies = new Cookies(req, res, {"keys": "keys"});

    if(cookies.get("user")){
      res.writeHead(200, {'Content-type':'text/html'});
      res.write(swig.renderFile("views/admin_panel.html", {user: cookies.get("user")}));
      res.end();
    }
});



app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
