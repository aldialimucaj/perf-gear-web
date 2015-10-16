var PGUtils = require("../public/js/src/pg_utils");
var expect = require("chai").expect;
var _ = require("lodash");


describe("Public.PG_UTILS", function () {
    var pg_utils = null;
	var fix = {};

	before(function () {
		pg_utils = new PGUtils();
		fix.m1 = { "_commitDate": "2015-10-11T19:32:59.907Z", 
			"_stats": { "average": 0, "count": 2, "max": 0, "min": 0, "sum": 0 }, 
			"hitValue": 0, 
			"id": "e6bb1502-dfe3-4b36-86f7-315c74483fbf", 
			"path": "examples/c/example2/mat_mul", 
			"sequence": [
				{ "tag": "start", "timestamp": 1444591979826895, "value": 0 }, 
				{ "tag": "created", "timestamp": 1444591979826897, "value": 0 }, 
				{ "tag": "end", "timestamp": 1444591979826898, "value": 0 }
			], 
			"type": "TIME", "unit": "MICROSECONDS" 
		};
		fix.s1 = {"type":"bar","xAxis":"path","yAxis":"_stats.count"};
	});

	after(function () {

	});
	
	/* ======================================================================== */

	describe("Results to Graph Configuration", function () {
		it("should transform a single bar chart", function () {
			var options = pg_utils.buildOptionsFromSingle(fix.m1, fix.s1);
			expect(options).not.to.be.null;
		});
	});


});