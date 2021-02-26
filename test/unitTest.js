var request = require('supertest');
var assert = require('assert');
 
// TEST HOMPEAGE DISPLAY
it('should respond with homepage', function (done) {
    request('http://localhost:7000')
      .get('/')
      .expect(200)
      .end(function (err, response) {
        assert.equal(response.header['content-type'], 'text/html; charset=utf-8');
        done();
      });
  });

// TEST 404 ERROR
  it('should send 404 when a request is made to any other path', function (done) {
    request('http://localhost:7000')
      .get('/games/nothing')
      .expect(404, done);
  });