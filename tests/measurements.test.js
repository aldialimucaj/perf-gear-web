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
    })
  });
});
