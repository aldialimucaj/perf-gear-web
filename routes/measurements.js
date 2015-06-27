/* @flow */
var express = require('express');
var router = express.Router();

/* POST measurement posting */

router.post('/', function(req, res, next) {
  console.log(req.body);
  res.status(201).send({ok: true});
});

module.exports = router;
