var mysql = require('mysql');


var MySql = function(){
    this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "CMS"
  });
  this.connection.connect();
  return this.connection;
}

MySql.prototype.getConnection = function(){
    return this.connection;
}

module.exports = MySql;
