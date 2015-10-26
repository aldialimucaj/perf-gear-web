/* @flow */
'use strict';

var express = require('express');
var _ = require('lodash');
var l = require('winston');
var r = require('rethinkdb');
var router = express.Router();

// internal depencencies
var rcon = require('../controllers/rethinkConnection');
var pgUtils = require('../controllers/pgUtils');

const DEFAULT_COLLECTION = 'default';

/* ========================================================================== */

/* GET collections */
router.get('/', function(req, res) {
  
  var reql = r.tableList();
  
  reql.run(rcon.conn, function(err, cursor) {
    if (cursor) cursor.toArray(function(err, result) {
      pgUtils.forwarder(res, err, result);
    });
    else pgUtils.forwarder(res, err, []);
  });
});

module.exports = router;