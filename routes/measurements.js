/* @flow */
var express = require('express');
var _ = require('lodash');
var l = require('winston');
var r = require('rethinkdb');
var router = express.Router();
var rcon = require('../controllers/rethinkConnection');


/* POST measurement posting */
router.post('/', function(req, res, next) {
  l.info(req.body);
  if (!_.isEmpty(req.body)) {
    if (rcon.conn) {
      r.table('measurements').insert(req.body)
        .run(rcon.conn, function(err, result) {
          res.status(201).send({
            ok: true,
            body: result
          });
        })
    } else {
      l.error('DB Connection not ready');
      res.status(200).send({
        ok: false
      });
    }
  } else {
    res.status(200).send({
      ok: false,
      err: 'Measurement payload was empty'
    });
  }
});

module.exports = router;
