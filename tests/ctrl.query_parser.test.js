var app = require('../app');
var rcon = require('../controllers/rethinkConnection');
var qparser = require('../controllers/query_parser');
var expect = require("chai").expect;
var request = require('supertest');
var r = require('rethinkdb');
var config = require('config');
var dbConfig = config.get('Database');

describe("Query Parser", function () {
    // ids used to index keys
	var ids = null;

	before(function (done) {
		setTimeout(function () {
			r.dbCreate(dbConfig.db).run(rcon.conn, function (err, resultDb) {
				r.db(dbConfig.db).tableCreate('measurements').run(rcon.conn, function (err, resultDb) {
					// adding new measurement
					r.table('measurements').insert([{
						path: 'measurements/tests/get/id/1'
					}, {
							path: 'measurements/tests/get/id/2'
						}, {
							path: 'measurements/tests/get/id/3'
						}, {
							path: 'measurements/tests/get/id/4'
						}])
						.run(rcon.conn, function (err, result) {
							if (err) return done(err);
							ids = result.generated_keys;
							done();
						});
				});
			});
		}, 1000);
	});

	after(function () {
		r.table('measurements').delete().run(rcon.conn, function (err, result) {
			// body...
		})
	});

	/* ======================================================================== */

	describe("PARSE", function () {
		it("should return measurements grouped by path", function () {
			var t = r.table('measurements');
			var query = { groupBy: 'path' };
			qparser.parse(query, t)
				.then((table) => {
					table.run(rcon.conn, function (err, cursor) {
						cursor.toArray(function (err, result) {
							expect(result.length).to.equal(4);
						});
					});
				})
				.catch((err) => {
					assert().fail();
				});

		});
	});

});