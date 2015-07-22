/* @flow */
'use strict';

var express = require('express');
var _ = require('lodash');
var l = require('winston');
var r = require('rethinkdb');
var router = express.Router();
var rcon = require('../controllers/rethinkConnection');


/* POST measurement posting */
router.post('/', dbChecker, function(req, res) {
  l.info(req.body);
  if (!_.isEmpty(req.body)) {
    let m = _.clone(req.body, true);
    m.insertDate = new Date();
    r.table('measurements').insert(m)
      .run(rcon.conn, function(err, result) {
        forwarder(res, err, result, 201);
      });
  } else {
    res.status(200).send({
      ok: false,
      err: 'Measurement payload was empty'
    });
  }
});

/* ========================================================================== */

/* GET measurements fetching */
router.get('/', dbChecker, function(req, res) {
  var reql = r.table('measurements');
  // add skip
  if (req.query.skip && parseInt(req.query.skip)) reql = reql.skip(parseInt(req.query.skip));
  // add limit
  if (req.query.limit && parseInt(req.query.limit)) reql = reql.limit(parseInt(req.query.limit));

  reql.run(rcon.conn, function(err, cursor) {
    if (cursor) cursor.toArray(function(err, result) {
      forwarder(res, err, result);
    });
    else forwarder(res, err, []);
  });
});

/* ========================================================================== */

/* GET single measurement fetching */
router.get('/:id', dbChecker, function(req, res) {
  var reql = r.table('measurements').get(req.params.id);

  reql.run(rcon.conn, function(err, result) {
    forwarder(res, err, result);
  })
});

/* ========================================================================== */
/* HELPERS */

function forwarder(res, err, result, statusCode) {
  if (!err) {
    res.status(statusCode || 200).send({
      ok: true,
      content: result
    });
  } else {
    res.status(200).send({
      ok: false,
      err: err
    });
  }
}

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

/* ========================================================================== */

module.exports = router;
