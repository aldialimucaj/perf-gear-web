/* @flow */
var express = require('express');
var l = require('winston');
var r = require('rethinkdb');
var router = express.Router();
var rcon = require('../controllers/rethinkConnection');


/* POST measurement posting */
router.post('/', function(req, res, next) {
  l.info(req.body);
  if (rcon.conn) {
    r.table('measurements').insert(req.body)
      .run(rcon.conn, function(err, result) {
        res.status(201).send(result);
      })
  } else {
    console.log('Connection not ready');
    res.status(200).send({
      ok: false
    });
  }
});

module.exports = router;
