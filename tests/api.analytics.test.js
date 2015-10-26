var app = require('../app');
var rcon = require('../controllers/rethinkConnection');
var expect = require("chai").expect;
var request = require('supertest');
var r = require('rethinkdb');
var config = require('config');
var dbConfig = config.get('Database');

describe("Analytics", function () {
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

	describe("/QUERY POST by group", function () {
		it("should return measurements grouped by path", function (done) {
			request(app)
				.post('/api/analytics/query')
				.set('Accept', 'application/json')
				.send({
					query: 'm.group("path");',
					collection: 'measurements'
				})
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function (err, res) {
					if (err) return done(err);
					expect(res.body.ok).eq(true);
					expect(res.body.content.length).eq(4);
					done()
				});
		});
	});

});