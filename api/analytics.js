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

const DEFAULT_COLLECTION = 'default';

/* ========================================================================== */

/* POST - query measurements */
router.post('/query', function (req, res) {
  let collection = req.body.collection || DEFAULT_COLLECTION;
  // create two variables, we expect m and measurement 
  var measurements = r.table(collection);
  var m = measurements;
  var reql = null;
  
  // the string query
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

module.exports = router;
