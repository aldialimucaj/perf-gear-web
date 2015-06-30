/* @flow */
var config = require('config');
var dbConfig = config.get('Database');
var winston = require('winston');
r = require('rethinkdb');

var connection = null;
exports.connect = function() {
  if (!connection) {
    var interval = setInterval(function() {
      r.connect(dbConfig, function(err, conn) {
        if (err) winston.error('[RethinkDB] ' + err.message);
        exports.conn = conn;
        if (!err && conn) clearInterval(interval);
      });
    }, 5000);
  }
}

exports.connect();
