var app = require('../app');
var rcon = require('../controllers/rethinkConnection');
var expect = require("chai").expect;
var request = require('supertest');
var r = require('rethinkdb');
var config = require('config');
var dbConfig = config.get('Database');

describe("Measurements", function() {
  // ids used to index keys
  var ids = null;

  before(function(done) {
    setTimeout(function() {
      r.dbCreate(dbConfig.db).run(rcon.conn, function(err, resultDb) {
        r.db(dbConfig.db).tableCreate('measurements').run(rcon.conn, function(err, resultDb) {
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
            .run(rcon.conn, function(err, result) {
              if (err) return done(err);
              ids = result.generated_keys;
              done();
            });
        });
      });
    }, 1000);
  });

  after(function() {
    r.table('measurements').delete().run(rcon.conn, function(err, result) {
      // body...
    })
  });

  /* ======================================================================== */

  describe(" / GET measurements (many)", function() {
    it("should return all measurements", function(done) {
      request(app)
        .get('/api/measurements')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body.ok).eq(true);
          expect(res.body.content.length).eq(4);
          done()
        });
    });

    it("should return only one measurement", function(done) {
      request(app)
        .get('/api/measurements')
        .set('Accept', 'application/json')
        .query({
          limit: 1
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body.ok).eq(true);
          expect(res.body.content.length).eq(1);
          done()
        });
    });

    it("should return only three measurements", function(done) {
      request(app)
        .get('/api/measurements')
        .set('Accept', 'application/json')
        .query({
          limit: 3
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body.ok).eq(true);
          expect(res.body.content.length).eq(3);
          done()
        });
    });

    it("should skip some measurements", function(done) {
      request(app)
        .get('/api/measurements')
        .set('Accept', 'application/json')
        .query({
          skip: 2
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body.ok).eq(true);
          expect(res.body.content.length).eq(2);
          done()
        });
    });
  });

  /* ======================================================================== */

  describe(" / GET measurement (one)", function() {
    it("should return one measurement", function(done) {
      request(app)
        .get('/api/measurements/' + ids[0])
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body.ok).eq(true);
          expect(res.body.content.id).eq(ids[0]);
          done()
        });
    });
  });

  /* ======================================================================== */

  describe(" / POST new measurement", function() {
    it("should accept new measurements", function(done) {
      request(app)
        .post('/api/measurements')
        .set('Accept', 'application/json')
        .send({
          path: 'measurements/tests/post/new'
        })
        .expect('Content-Type', /json/)
        .expect(201, done);
    });

    it("should fail on empty measurements", function(done) {
      request(app)
        .post('/api/measurements')
        .set('Accept', 'application/json')
        .send({})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body.ok).eq(false);
          expect(res.body.err).eq('Measurement payload was empty');
          done()
        });
    });
  });
});
