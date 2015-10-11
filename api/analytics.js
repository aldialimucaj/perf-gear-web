/* @flow */
// analytics.js
'use strict';

var Promise = require('promise');
var express = require('express');
var _ = require('lodash');
var l = require('winston');
var r = require('rethinkdb');
var router = express.Router();

// internal depencencies
var rcon = require('../controllers/rethinkConnection');
var pgUtils = require('../controllers/pgUtils');
var queryParser = require('../controllers/query_parser');

/* ========================================================================== */

/* GET - measurements fetching */
router.get('/', dbChecker, function (req, res) {
  var reql = r.table('measurements');
  // add skip
  if (req.query.skip && parseInt(req.query.skip)) reql = reql.skip(parseInt(req.query.skip));
  // add limit
  if (req.query.limit && parseInt(req.query.limit)) reql = reql.limit(parseInt(req.query.limit));

  reql.run(rcon.conn, function (err, cursor) {
    if (cursor) cursor.toArray(function (err, result) {
      pgUtils.forwarder(res, err, result);
    });
    else pgUtils.forwarder(res, err, []);
  });
});



/* POST - query measurements */
router.post('/query', dbChecker, function (req, res) {
  var measurements = r.table('measurements');
  var m = measurements;
  var reql = null;
  var query = req.body.query;
  try {
    eval("reql = " + query);
    reql.run(rcon.conn, function (err, cursor) {
      if (cursor && cursor.toArray) cursor.toArray(function (err, result) {
        pgUtils.forwarder(res, err, result);
      });
      else pgUtils.forwarder(res, err, cursor);
    });
  } catch (e) {
    pgUtils.forwarder(res, e);
  }
});

/**
 * Check db conenection
 */
function dbChecker(req, res, next) {
  if (rcon.conn) {
    next();
  } else {
    l.error('DB Connection not ready');
    res.status(200).send({
      ok: false
    });
  }
}

module.exports = router;
