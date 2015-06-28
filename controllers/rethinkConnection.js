/* @flow */
var config = require('config');
var dbConfig = config.get('Database');
r = require('rethinkdb');

var connection = null;
if (!connection) {
  r.connect(dbConfig, function(err, conn) {
    if (err) throw err;
    exports.conn = conn;
  });
}
