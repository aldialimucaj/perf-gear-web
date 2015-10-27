var express = require('express');
var router = express.Router();

/* GET Measurements home page. */
router.get('/:collection', function (req, res, next) {
  res.render('measurements', { params: req.params });
});

/* GET measurement by id. */
router.get('/:collection/:id', function (req, res, next) {
  res.render('measurement', { params: req.params });
});

module.exports = router;
