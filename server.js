'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	log = require('./config/logger'),
	mongoose = require('mongoose'),
  passport = require('passport');
/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
var app;
// Bootstrap db connection
mongoose.Promise = global.Promise;
var db = mongoose.connect(config.db);
// Check if MongoDB is running
mongoose.connection.on('error', function(err) {
	log.error('Mongoose DB Connection Error. Make sure MongoDB is running.\n'+err);
	console.error('MongoDB Connection Error. Make sure MongoDB is running.\n'+err);
});
mongoose.connection.on('open', function() {
  console.log('Mongoose DB connected.');
  log.debug('Mongoose DB connected.');

  // Initializing Express application only after Mongoose connected to DB, else Passport Session for MongoDB connection will fail in express.js file
  var app = require('./config/express')(db);

  // Bootstrap passport config
  console.log('About to read passport config file:');
  require('./config/passport')(passport);
  
  function onListening() {
  	console.log('Listening on port:'+ server.address().port);
  	log.debug('log.debug Listening on port:' + server.address().port);
  }
  // Start the app by listening on <port>
  var server = app.listen(config.port || 3000, onListening);

});





// Expose app
/*exports = module.exports = app;*/
