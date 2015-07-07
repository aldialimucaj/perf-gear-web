var express = require('express');
var router = express.Router();

/* GET Measurements home page. */
router.get('/', function (req, res, next) {
  res.render('measurements', null);
});

/* GET measurement by id. */
router.get('/:id', function (req, res, next) {
  res.render('measurement', { params: req.params });
});

module.exports = router;
