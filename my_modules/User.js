
var Db = require('./mysql_connect.js');

var User = function(){
  this.db = new Db();
}

User.prototype.auth = function(user, pass, callback){
  this.db.query("SELECT * FROM Users WHERE username = ? and pass = ?", [user, pass], function(err, rows){
    if(err) throw err;
    callback((rows.length > 0)? true : false, user);
  });
}

User.prototype.createUser = function(name, surname, date_of_birth ,username, password){
    this.db.query("INSERT INTO Users(nome,cognome,data_di_nascita, username, pass) VALUES (?,?,?,?,?)", [name,surname,date_of_birth, username,password], function(err, rows){
      if(err) throw err;
    });
  }

module.exports = User;
