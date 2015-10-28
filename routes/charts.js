var express = require('express');
var router = express.Router();


/* GET charts home page. */
router.get('/', function (req, res, next) {
  res.render('charts', { params: req.params });
});


/* GET Charts home page. */
router.get('/:collection', function (req, res, next) {
  res.render('charts', { params: req.params });
});

/* GET Charts by id. */
router.get('/:collection/:id', function (req, res, next) {
  res.render('charts', { params: req.params });
});

module.exports = router;
