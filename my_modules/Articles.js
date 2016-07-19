var MySql = require('./mysql_connect');

var Articles = function(){
  this.db = new MySql();
}

Articles.prototype.create = function(user, title,description){
    this.db.query("INSERT INTO articles(title, description, FK_user) VALUES (?,?,?)", [title, description, user], function(err, rows){
        if(err) throw err;
    });
}

Articles.prototype.read = function(id, callback){
  if(id == null){
    this.db.query("SELECT * FROM articles", function(err, rows){
      if(err) throw err;
    //console.log(rows);
      callback(rows);
    });

  }else{
    this.db.query("SELECT * FROM articles WHERE id = ?", [id], function(err, rows){
      if(err) throw err;
        callback(rows);
    });
  }

}

Articles.prototype.update = function(id, title, description){
  this.db.query("UPDATE article SET title = ?, description = ? WHERE id = ?", [title, description, id], function(err, rows){
    if(err) throw err;
    return rows;
  });
}

Articles.prototype.delete = function(id){
  this.db.query("DELETE FROM articles WHERE id = ?",[id], function(err, rows){
    if(err) throw err;
  });
}

module.exports = Articles;
