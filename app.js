/* @flow */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var l = require('winston');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var measurements = require('./routes/measurements');
var analytics = require('./routes/analytics');

/* API */
var apiAnalytics = require('./api/analytics');
var apiCollections = require('./api/collections');
var apiMeasurements = require('./api/measurements');

var rcon = require('./controllers/rethinkConnection');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Routes */
app.use('/', routes);
app.use('/users', users);
app.use('/analytics', analytics);
app.use('/measurements', measurements);

/* API Routes */
app.use('/api/analytics', rcon.dbChecker, apiAnalytics);
app.use('/api/collections', rcon.dbChecker, apiCollections);
app.use('/api/measurements', rcon.dbChecker, apiMeasurements);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
