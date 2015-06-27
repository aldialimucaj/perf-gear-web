/* @flow */
var config = require('config');
var dbConfig = config.get('Database');
r = require('rethinkdb');

var connection = null;
if (!connection) {
  r.connect({
    host: dbConfig.host,
    port: dbConfig.port,
    db: dbConfig.name
  }, function(err, conn) {
    if (err) throw err;
    exports.conn = conn;
  });
}
