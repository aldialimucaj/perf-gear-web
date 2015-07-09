/* @flow */
var config = require('config');
var dbConfig = config.get('Database');
var winston = require('winston');
var r = require('rethinkdb');

/* Timeout to wait for reconnection */
var timeOut = 1;

exports.connect = function() {
  if (!exports.conn) {
    r.connect(dbConfig, function(err, conn) {
      if (err) {
        timeOut = (++timeOut % 9);
        winston.error('[RethinkDB] ' + err.message);
        winston.info("[RethinkDB] next retry in " + timeOut + " seconds")
        setTimeout(exports.connect, timeOut * 1000);
      } else {
        exports.conn = conn;
        timeOut = 1;
      }
    });
  }
}

exports.connect();
