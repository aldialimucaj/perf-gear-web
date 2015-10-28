/* @flow */
'use strict';

var express = require('express');
var _ = require('lodash');
var l = require('winston');
var r = require('rethinkdb');
var router = express.Router();

// internal depencencies
var rcon = require('../controllers/rethinkConnection');

const DEFAULT_COLLECTION = 'default';

/* POST measurement to variable collection */
router.post('/:collection?', function(req, res) {
  l.info(req.body);
  let collection = req.params.collection || DEFAULT_COLLECTION;
  if (!_.isEmpty(req.body)) {
    // pre commit operations to add date, calc, ...
    let m = preCommit(req.body);

    r.table(collection).insert(m)
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
router.get('/:collection', function(req, res) {
  let collection = req.params.collection || DEFAULT_COLLECTION;
  var reql = r.table(collection);
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

/* GET measurements count */
router.get('/:collection/count', function(req, res) {
  let collection = req.params.collection || DEFAULT_COLLECTION;
  var reql = r.table(collection).count();

  reql.run(rcon.conn, function(err, result) {
    forwarder(res, err, result);
  });
});

/* ========================================================================== */

/* GET single measurement fetching */
router.get('/:collection/:id', function(req, res) {
  let collection = req.params.collection || DEFAULT_COLLECTION;
  var reql = r.table(collection).get(req.params.id);

  reql.run(rcon.conn, function(err, result) {
    forwarder(res, err, result);
  })
});

/* ========================================================================== */
/* HELPERS */


/**
 * Check if there was an error. If so respond with err message and status code.
 */
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

/**
 * Measurement pre commit editor. It adds various optional fields to the
 * measurement.
 * @return edited measurement
 */
function preCommit(measurement) {
  var m = _.clone(measurement, true);
  m._commitDate = new Date();

  // adding statistical and arithmetical values
  if (m.type) {
    switch (m.type.toUpperCase()) {
      case "TIME":
        m._stats = calculateStats(m);
        break;
    }
  }

  return m;
}

/**
 * Returns statistical and arithmetical values over the measurements sequence.
 * It counts the difference between two sequences as an item. Not the measurement
 * itself. So we have a count of sequences - 1.
 */
function calculateStats(measurement) {
  var stats = {};
  let _length = measurement.sequence ? measurement.sequence.length : 0;

  if (measurement.sequence && _length > 0) {
    let _sum = 0;
    let _tempAvg = measurement.sequence[0].value;
    let _min = Number.MAX_VALUE;
    let _max = 0;

    measurement.sequence.forEach(function(v, i) {
      let _delta = (v.value - _tempAvg);
      _sum += _delta;
      // special case if index = 0 then first delta is 0
      if (i != 0) {
        _min = Math.min(_min, _delta);
        _max = Math.max(_max, _delta);
      }
      _tempAvg = v.value;
    });

    // set stat values
    stats.min = _min;
    stats.max = _max;
    stats.sum = _sum;
    stats.count = (_length - 1);
    stats.average = _sum / (_length - 1);
  }

  return stats;
}

/* ========================================================================== */

module.exports = router;
