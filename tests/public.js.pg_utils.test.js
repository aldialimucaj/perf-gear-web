var PGUtils = require("../public/js/src/pg_utils");
var expect = require("chai").expect;
var _ = require("lodash");


describe("Public.PG_UTILS", function () {
    var pg_utils = null;
	var fix = {};

	
	/* ======================================================================== */
	describe("Get a list of axis fields out of object", function() {
		it("should compile a list of itmes out of a plain object", function() {
			// bar x-axis
			var xKeyList = pg_utils.getAxisItems("bar","xAxis",fix.getAxisItems.m1);
			expect(xKeyList).to.be.eql(fix.getAxisItems.e1);
			// bar y-axis
			var yKeyList = pg_utils.getAxisItems("bar","yAxis",fix.getAxisItems.m1);
			expect(yKeyList).to.be.eql(fix.getAxisItems.e1_2);
			
			// complex object with subobject, recursion test
			var xKeyList = pg_utils.getAxisItems("bar","xAxis",fix.getAxisItems.m2);
			expect(xKeyList).to.be.eql(fix.getAxisItems.e2);
			// type line
			var xKeyList = pg_utils.getAxisItems("line","xAxis",fix.getAxisItems.m2);
			expect(xKeyList).to.be.eql(fix.getAxisItems.e2);
			
			// sequence
			var xKeyList = pg_utils.getAxisItems("seq","xAxis",fix.getAxisItems.m2);
			expect(xKeyList).to.be.eql(fix.getAxisItems.e2_1);
		});
	});

	/* ======================================================================== */
	describe("Results to Graph Configuration", function () {
		it("should transform a single bar chart", function () {
			var options = pg_utils.buildOptionsFromSingle(fix.m1, fix.s1);
			expect(options).not.to.be.null;
		});
	});
	
	
	/* ======================================================================== */
	before(function () {
		pg_utils = new PGUtils();
		// -----
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
		// -#-#-#-#-
		fix.getAxisItems = {};
		fix.getAxisItems.m1 = {
			"_commitDate": "2015-10-15T07:03:33.761Z",
			"hitValue": 3,
			"id": "306ebff0-5ced-401b-a382-df1b125dc850",
			"path": "examples/c/example2/add2",
			"sequence": [],
			"type": "HIT",
			"unit": "HITS"
		};
		fix.getAxisItems.e1 = ["_commitDate","hitValue","id","path","type","unit"];
		fix.getAxisItems.e1_2 = ["hitValue"];
		fix.getAxisItems.m2 = { 
			"_commitDate": "2015-10-11T19:32:59.907Z", 
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
		fix.getAxisItems.e2 = ["_commitDate","_stats.average","_stats.count","_stats.max","_stats.min","_stats.sum","hitValue","id","path","type","unit"];
		fix.getAxisItems.e2_1 = ["sequence"];
	});

	after(function () {

	});


});