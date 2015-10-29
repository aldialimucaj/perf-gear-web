/* @flow */
'use strict';

var express = require('express');
var _ = require('lodash');
var l = require('winston');
var r = require('rethinkdb');
var request = require('request');
var router = express.Router();

var PGUtils = require("../public/js/src/pg_utils");
var graphBuilder = new PGUtils();

// internal depencencies
var rcon = require('../controllers/rethinkConnection');
var pgUtils = require('../controllers/pgUtils');

const DEFAULT_COLLECTION = 'default';
const DEFAULT_CHART_TABLE = 'charts';
const TYPE_ANALYTICS = 'analytics';
const TYPE_MEASUREMENT = 'single_measurement';

/* POST chart to default collection */
router.post('/', function(req, res) {
  l.info(req.body);
  if (!_.isEmpty(req.body)) {
    // pre commit operations to add date, ...
    let m = preCommit(req.body);

    r.table(DEFAULT_CHART_TABLE).insert(m)
      .run(rcon.conn, function(err, result) {
        pgUtils.forwarder(res, err, result, 201);
      });
  } else {
    res.status(200).send({
      ok: false,
      err: 'Chart payload was empty'
    });
  }
});


/* ========================================================================== */

/* GET charts fetching */
router.get('/:collection', function(req, res) {
  let collection = req.params.collection || DEFAULT_COLLECTION;
  var reql = r.table(DEFAULT_CHART_TABLE).filter(r.row('collection').eq(collection));
  // add skip
  if (req.query.skip && parseInt(req.query.skip)) reql = reql.skip(parseInt(req.query.skip));
  // add limit
  if (req.query.limit && parseInt(req.query.limit)) reql = reql.limit(parseInt(req.query.limit));

  reql.run(rcon.conn, function(err, cursor) {
    if (cursor) cursor.toArray(function(err, result) {
      pgUtils.forwarder(res, err, result);
    });
    else pgUtils.forwarder(res, err, []);
  });
});

/* GET charts count */
router.get('/:collection/count', function(req, res) {
  let collection = req.params.collection || DEFAULT_COLLECTION;
  var reql = r.table(DEFAULT_CHART_TABLE).filter(r.row('collection').eq(collection)).count();

  reql.run(rcon.conn, function(err, result) {
    pgUtils.forwarder(res, err, result);
  });
});

/* ========================================================================== */

/* GET single chart fetching */
router.get('/:id/:collection/options', function(req, res) {
  let collection = req.params.collection || DEFAULT_COLLECTION;
  var reql = r.table(DEFAULT_CHART_TABLE).get(req.params.id);

  reql.run(rcon.conn, function(err, chart) {
    switch(chart.type) {
      case TYPE_ANALYTICS: {
        request(
          {
            url: 'http://localhost:4000/api/analytics/query',
            method: "POST",
            json: true,
            body: {query: chart.query, collection: collection}
          }, 
          function(err, response, body) {
            let result = body.content;
            let buildOptions = graphBuilder.buildGraphFromMultiple(result, chart.selection);
            pgUtils.forwarder(res, err, buildOptions);
        });        
        break;
      }
      default:
        pgUtils.forwarder(res, "Wrong Chart Type", []);
    }
  })
});



/* ========================================================================== */
/* HELPERS */


/**
 * Chart pre commit editor. It adds various optional fields to the
 * chart configuration.
 * @return edited chart
 */
function preCommit(chart) {
  var c = _.clone(chart, true);
  c._commitDate = new Date();

  return c;
}



/* ========================================================================== */

module.exports = router;
