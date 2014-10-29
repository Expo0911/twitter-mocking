// Copyright 2013 Bowery Software, LLC
/**
 * @fileoverview Test search methods.
 */


// Module Dependencies.
var assert = require('assert')
var nock = require('nock')
var token = require('./creds').token
var db = require('../lib-cov/client')(token)

var users = {
  steve: {
    "name": "Steve Kaliski",
    "email": "sjkaliski@gmail.com",
    "location": "New York",
    "type": "paid",
    "gender": "male"
  }
}

// Override http requests.
var fakeOrchestrate = nock('https://api.orchestrate.io/')
  .get('/v0/users?query=denver')
  .reply(200, {
    "results": [],
    "count": 0
  })
  .get('/v0/users?query=new%20york&limit=5&offset=2')
  .reply(200, {
    "results": [
      {
        "path": {
          "collection": "users",
          "key": "sjkaliski@gmail.com",
          "ref": "0eb6642ca3efde45"
        },
        "value": {
          "name": "Steve Kaliski",
          "email": "sjkaliski@gmail.com",
          "location": "New York",
          "type": "paid",
          "gender": "male"
        },
        "score": 0.10848885029554367
      }
    ],
    "count": 1,
    "max_score": 0.10848885029554367
  })
  .get('/v0/users?query=new%20york&offset=0')
  .reply(200, {
    "results": [
      {
        "path": {
          "collection": "users",
          "key": "sjkaliski@gmail.com",
          "ref": "0eb6642ca3efde45"
        },
        "value": {
          "name": "Steve Kaliski",
          "email": "sjkaliski@gmail.com",
          "location": "New York",
          "type": "paid",
          "gender": "male"
        },
        "score": 0.10848885029554367
      }
    ],
    "count": 1,
    "max_score": 0.10848885029554367
  })
  .get('/v0/users?query=new%20york&sort=value.name%3Adesc')
  .reply(200)
  .delete('/v0/users?force=true')
  .reply(204)
  .get('/v0/users?query=new%20york&sort=value.name%3Adesc%2Cvalue.age%3Aasc')
  .reply(200)
  .get('/v0/users?query=location%3ANEAR%3A%7Blat%3A1%20lon%3A1%20dist%3A1km%7D&sort=value.name%3Adesc%2Cvalue.location%3Adist%3Aasc')
  .reply(200)

suite('Search', function () {
  test('Get value by query', function (done) {
    db.newSearchBuilder()
    .collection('users')
    .limit(5)
    .offset(2)
    .query('new york')
    .then(function (res) {
      assert.equal(200, res.statusCode)
      assert.deepEqual(res.body.results[0].value, users.steve)
      done()
    })
  })

  test('Get value by query with offset 0', function (done) {
    db.newSearchBuilder()
    .collection('users')
    .offset(0)
    .query('new york')
    .then(function (res) {
      assert.equal(200, res.statusCode)
      assert.deepEqual(res.body.results[0].value, users.steve)
      done()
    })
  })

  test('Get value by query and sort by name descending', function (done) {
    db.newSearchBuilder()
    .collection('users')
    .sort('name', 'desc')
    .query('new york')
    .then(function (res) {
      assert.equal(200, res.statusCode)
      done()
    })
  })

  test('Multiple field sort', function (done) {
    db.newSearchBuilder()
    .collection('users')
    .sort('name', 'desc')
    .sort('age', 'asc')
    .query('new york')
    .then(function (res) {
      assert.equal(200, res.statusCode)
      done()
    })
    .fail(done)
  })

  test('Geo queries support', function (done) {
    db.newSearchBuilder()
    .collection('users')
    .sort('name', 'desc')
    .sort('location', 'dist:asc')
    .query('location:NEAR:{lat:1 lon:1 dist:1km}')
    .then(function (res) {
      assert.equal(200, res.statusCode)
      done()
    })
    .fail(done)
  })

  test('Calling search() directly on the client w/o options', function (done) {
    db.search('users', 'denver').then(function (res) {
      assert.equal(200, res.statusCode);
      assert.equal(res.body.count, 0);
      done()
    })
  })
})
