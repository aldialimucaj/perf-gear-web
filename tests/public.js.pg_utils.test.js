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
			
			
		});
		it("should compile a list of itmes out of a complex object and sequence", function(){
			// complex object with subobject, recursion test
			var xKeyList = pg_utils.getAxisItems("bar","xAxis",fix.getAxisItems.m2);
			expect(xKeyList).to.be.eql(fix.getAxisItems.e2);
			// type line
			var xKeyList = pg_utils.getAxisItems("line","xAxis",fix.getAxisItems.m2);
			expect(xKeyList).to.be.eql(fix.getAxisItems.e2);
			
			// sequence
			var xKeyList = pg_utils.getAxisItems("seq","xAxis",fix.getAxisItems.m2);
			expect(xKeyList).to.be.eql(fix.getAxisItems.e2_1);
		})
	});

	/* ======================================================================== */
	describe("Build graph options from single measurement", function () {
		it("should transform a single measurement", function () {
			var options = pg_utils.buildOptionsFromSingle(fix.buildOptionsFromSingle.m1, fix.buildOptionsFromSingle.s1);
			expect(options).not.to.be.null;
			expect(options).to.be.eql(fix.buildOptionsFromSingle.e1);
		});
	});
	
	/* ======================================================================== */
	describe("Build graph options from single sequencial TIME measurement", function () {
		it("should transform a single measurement", function () {
			var options2 = pg_utils.buildOptionsFromSingleTimestamp(fix.buildOptionsFromSingle.m1, fix.buildOptionsFromSingle.s1_2);
			expect(options2).not.to.be.null;
			expect(options2).to.be.eql(fix.buildOptionsFromSingle.e1_2);
		});
	});
	
	/* ======================================================================== */
	describe("Build graph options from single sequencial RAM measurement", function () {
		it("should transform a single measurement", function () {
			var options = pg_utils.buildOptionsFromSingleRAM(fix.buildOptionsFromSingleRAM.m1, fix.buildOptionsFromSingleRAM.s1);
			expect(options).not.to.be.null;
			expect(options).to.be.eql(fix.buildOptionsFromSingleRAM.e1);
		});
	});
	
	/* ======================================================================== */
	describe("Create phantom measurement to match graph axes options", function () {
		it("should transform all measurements to one phaton measurement", function (done) {
			pg_utils.queryResultsToMeasurement(fix.queryResultsToMeasurement.m1, (err, phantom) => {
				expect(phantom).not.to.be.null;
				expect(phantom).to.be.eql(fix.queryResultsToMeasurement.e1);
				done();
			});
		});
	});
	
	/* ======================================================================== */
	describe("Results to Graph Configuration", function () {
		it("should transform a single bar chart", function () {
			
		});
	});
	
	
	/* ======================================================================== */
	before(function () {
		pg_utils = new PGUtils();
		// -----
		fix.buildOptionsFromSingle = {};
		fix.buildOptionsFromSingle.m1 = { "_commitDate": "2015-10-11T19:32:59.907Z", 
			"_stats": { "average": 0, "count": 2, "max": 0, "min": 0, "sum": 0 }, 
			"hitValue": 5, 
			"id": "e6bb1502-dfe3-4b36-86f7-315c74483fbf", 
			"path": "examples/c/example2/mat_mul", 
			"sequence": [
				{ "tag": "start", "timestamp": 1444591979826895, "value": 0 }, 
				{ "tag": "created", "timestamp": 1444591979826897, "value": 0 }, 
				{ "tag": "end", "timestamp": 1444591979826898, "value": 0 }
			], 
			"type": "TIME", "unit": "MICROSECONDS" 
		};
		fix.buildOptionsFromSingle.s1 = {"type":"bar","xAxis":"path","yAxis":"hitValue"};
		fix.buildOptionsFromSingle.s1_2 = {"type":"seq","yAxis":"sequence"};
		fix.buildOptionsFromSingle.e1 = {"xAxis":[{"type":"category","data":["examples/c/example2/mat_mul"]}],"yAxis":[{"type":"value"}],"series":[{"name":"hitValue","type":"bar","data":[5]}],"tooltip":{"show":true}};
		fix.buildOptionsFromSingle.e1_2 = {"legend":{"data":["start","created","end"]},"xAxis":[{"type":"value"}],"yAxis":[{"type":"category","data":["sequence"]}],"series":[{"name":"start","type":"bar","stack":"true","barMaxWidth":25,"itemStyle":{"normal":{"label":{"show":true,"position":"insideRight"}}},"data":[0]},{"name":"created","type":"bar","stack":"true","barMaxWidth":25,"itemStyle":{"normal":{"label":{"show":true,"position":"insideRight"}}},"data":[2]},{"name":"end","type":"bar","stack":"true","barMaxWidth":25,"itemStyle":{"normal":{"label":{"show":true,"position":"insideRight"}}},"data":[1]}],"tooltip":{"show":true}};
		
		// -#-#-#-#-
		fix.buildOptionsFromSingleRAM = {};
		fix.buildOptionsFromSingleRAM.m1 = {
					"_commitDate": "2015-10-24T16:24:40.781Z",
					"hitValue": 3,
					"id": "e24c9d38-fcf0-446d-bfde-d5f0d6ef11e4",
					"path": "test/api/ram_usage",
					"sequence": [
						{
						"timestamp": 1445703880412600,
						"value": 6196
						},
						{
						"timestamp": 1445703880595118,
						"value": 6608
						},
						{
						"timestamp": 1445703880770565,
						"value": 6640
						}
					],
					"type": "RAM",
					"unit": "KIBIBYTE"
				}
		fix.buildOptionsFromSingleRAM.s1 = {"type":"seq","yAxis":"sequence"};
		fix.buildOptionsFromSingleRAM.e1 ={"legend":{"data":["Sequence"]},"xAxis":[{"type":"category","data":["at 0µs","at 182518µs","at 357965µs"]}],"yAxis":[{"type":"value"}],"series":[{"name":"Sequence","type":"line","stack":"true","itemStyle":{"normal":{"label":{"show":true,"position":"insideRight"}}},"data":[6196,6608,6640],"markLine":{"data":[{"type":"average","name":"Average"}]}}],"tooltip":{"show":true}}
		
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
		
		// -#-#-#-#-
		fix.queryResultsToMeasurement = {};
		fix.queryResultsToMeasurement.m1 = [
			{
				"_commitDate": "2015-10-24T16:23:33.174Z",
				"hitValue": 1,
				"id": "384aa805-a476-4114-ac28-7ddaeba926c7",
				"path": "test/api/constructor",
				"sequence": [],
				"type": "HIT",
				"unit": "HITS",
				"extra": "this should be there"
			},
			{
				"_commitDate": "2015-10-11T19:32:59.928Z",
				"hitValue": 5,
				"id": "630e1aff-8191-4bcf-b359-ab33eaa9a615",
				"path": "examples/c/example2/fibonacci_at",
				"sequence": [],
				"type": "HIT",
				"unit": "HITS",
				"AnIntKey" : 0
			},
			{
				"_commitDate": "2015-10-24T16:22:25.592Z",
				"hitValue": 1,
				"id": "649c170c-faa4-4a2f-a900-0c02aad01dac",
				"path": "test/api/params",
				"sequence": [],
				"test": "dynamic params",
				"type": "HIT",
				"unit": "HITS",
				"someRandom": true
			}];
			
			fix.queryResultsToMeasurement.e1 = {
				"_commitDate": "2015-10-24T16:22:25.592Z",
				"hitValue": 1,
				"id": "649c170c-faa4-4a2f-a900-0c02aad01dac",
				"path": "test/api/params",
				"sequence": [],
				"test": "dynamic params",
				"type": "HIT",
				"unit": "HITS",
				"extra": "this should be there",
				"AnIntKey" : 0,
				"someRandom": true
			}
		
	});

	after(function () {

	});


});