var expect = require("chai").expect;
var request = require('supertest');
var app = require('../app');

describe("Measurements", function() {
  describe(" / POST new measurement", function() {
    it("should accept new measurements", function(done) {
      request(app)
        .post('/measurements')
        .set('Accept', 'application/json')
        .send({
          path: 'measurements/tests/post/new'
        })
        .expect('Content-Type', /json/)
        .expect(201, done);
    });

    it("should fail on empty measurements", function(done) {
      request(app)
        .post('/measurements')
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
  /* ======================================================================== */
  describe(" / GET measurements (many)", function() {
    it("should return all measurements", function(done) {
      request(app)
        .get('/measurements')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it("should return only one measurement", function(done) {
      request(app)
        .get('/measurements')
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
        .get('/measurements')
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

    // this test needs static fixtures to work. To be added!
    it("should skip some measurements", function(done) {
      request(app)
        .get('/measurements')
        .set('Accept', 'application/json')
        .query({
          skip: 3
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  /* ======================================================================== */

  describe(" / GET measurement (one)", function() {
    var id = null;
    // adding new measurement
    it("create test measurement", function(done) {
      request(app)
        .post('/measurements')
        .set('Accept', 'application/json')
        .send({
          path: 'measurements/tests/get/id'
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          id = res.body.content.generated_keys[0];
          console.log(res.body);
          done();
        });
    });

    it("should return one measurement", function(done) {
      request(app)
        .get('/measurements/' + id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body.ok).eq(true);
          expect(res.body.content.id).eq(id);
          done()
        });
    });
  });
});
