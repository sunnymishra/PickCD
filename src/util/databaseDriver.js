var mysql = require('mysql');
var path = require('path');
var dbconfig = require(path.join(path.dirname(require.main.filename),'../resources/db.json'));

DatabaseDriver = function() {
};

var datasource = {
  connectionLimit:dbconfig.dbconnectionLimit, //important
  host:dbconfig.dbhost,
  user:dbconfig.dbuser,
  password:dbconfig.dbpassword,
  database:dbconfig.dbdatabase,
  debug:dbconfig.dbdebug,
  supportBigNumbers:true
}

DatabaseDriver.connectionPool = mysql.createPool(datasource);


exports.DatabaseDriver = DatabaseDriver;
