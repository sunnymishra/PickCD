var mysql = require('mysql');
var path = require('path');
var dbconfig = require(path.join(path.dirname(require.main.filename),'./resources/db.json'));
var MongoClient = require("mongodb").MongoClient;

DatabaseDriver = function() {
};

var mysqldatasource = {
  connectionLimit:dbconfig.dbconnectionLimit, //important
  host:dbconfig.dbhost,
  user:dbconfig.dbuser,
  password:dbconfig.dbpassword,
  database:dbconfig.dbdatabase,
  debug:dbconfig.dbdebug,
  supportBigNumbers:true
}

DatabaseDriver.mysqlconnectionPool = mysql.createPool(mysqldatasource);


MongoClient.connect('mongodb://localhost:27017/pickCDdev1?connectTimeoutMS=60000', function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  // Save database object from the callback for reuse.
  DatabaseDriver.db=database;
  console.log("Database connection ready");
});

exports.DatabaseDriver = DatabaseDriver;
