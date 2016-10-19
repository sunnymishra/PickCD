var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var accountRoutes = require('./src/routes/AccountRoutes');
var goalRoutes = require('./src/routes/GoalRoutes');

var log = require('./lib/logger');

var nconf = require('nconf');
// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();
// Then load configuration from a designated file.
nconf.file({ file: './resources/config.json' });
// Provide default values for settings not provided above.
nconf.defaults(); // You can put any object of default values in this


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('env','development'); // IMPORTANT :: Change this to Prod in production

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
//app.use(express.logger('dev'));
//app.use(logger('dev')); 
log.debug("Overriding 'Express' logger");
app.use(require('morgan')("combined",{ "stream": log.stream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/focusroot/webservice/account', accountRoutes);
app.use('/focusroot/webservice/goal', goalRoutes);

app.get('/errortest', function(req, res, next){
    next(new Error('Test error!'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  //log.debug('Not found URL: %s',req.url);
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    //console.log(err.stack);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}


module.exports = app;
