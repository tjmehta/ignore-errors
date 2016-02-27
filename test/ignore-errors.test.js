var util = require('util')

var Code = require('code')
var hasProps = require('101/has-properties')
var Lab = require('lab')
var lab = exports.lab = Lab.script()

var createIgnore = require('../index.js')
var CustomError = function CustomError (msg) {
  this.message = msg
  Error.captureStackTrace(this, this.constructor)
}
util.inherits(CustomError, Error)

var StrictBabelClass = function (msg) {
  // mock babel class: classCallCheck()
  this.message = msg
  Error.captureStackTrace(this, this.constructor)
}
util.inherits(StrictBabelClass, Error)

var describe = lab.describe
var it = lab.it
var before = lab.before
var after = lab.after
var expect = Code.expect

describe('ignore-errors', function () {
  it('should ignore errors by regex', function (done) {
    var ignore = createIgnore()
    var err = new Error('something bad')
    Promise
      .reject(err)
      .catch(ignore(/something bad/))
      .then(done)
      .catch(done)
  })

  it('should ignore errors by string code', function (done) {
    var ignore = createIgnore()
    var err = new Error('boom')
    err.code = 'INVALID_FOO'
    Promise
      .reject(err)
      .catch(ignore('INVALID_FOO'))
      .then(done)
      .catch(done)
  })

  it('should ignore errors by string custom code', function (done) {
    var ignore = createIgnore('custom')
    var err = new Error('boom')
    err.custom = 'INVALID_FOO'
    Promise
      .reject(err)
      .catch(ignore('INVALID_FOO'))
      .then(done)
      .catch(done)
  })

  it('should ignore errors by number code', function (done) {
    var ignore = createIgnore()
    var err = new Error('boom')
    err.code = 100
    Promise
      .reject(err)
      .catch(ignore(100))
      .then(done)
      .catch(done)
  })

  it('should ignore errors by custom number code', function (done) {
    var ignore = createIgnore('statusCode')
    var err = new Error('boom')
    err.statusCode = 100
    Promise
      .reject(err)
      .catch(ignore(100))
      .then(done)
      .catch(done)
  })

  it('should ignore errors by object', function (done) {
    var ignore = createIgnore()
    var err = new Error('boom')
    err.foo = 'foo'
    err.bar = 'bar'
    Promise
      .reject(err)
      .catch(ignore({ foo: 'foo', bar: 'bar' }))
      .then(done)
      .catch(done)
  })

  it('should ignore errors by class', function (done) {
    var ignore = createIgnore()
    var err = new CustomError('boom')
    Promise
      .reject(err)
      .catch(ignore(CustomError))
      .then(done)
      .catch(done)
  })

  it('should ignore errors by es6 class', function (done) {
    var ignore = createIgnore()
    var err = new StrictBabelClass('boom')
    Promise
      .reject(err)
      .catch(ignore(StrictBabelClass))
      .then(done)
      .catch(done)
  })

  it('should ignore errors by function', function (done) {
    var ignore = createIgnore()
    var err = new Error('boom')
    Promise
      .reject(err)
      .catch(ignore(function () {
        return true
      }))
      .then(done)
      .catch(done)
  })

  describe('errors', function() {
    it('should not ignore errors if regex doesn\'t match', function (done) {
      var ignore = createIgnore()
      var err = new Error('bad')
      Promise
        .reject(err)
        .catch(ignore(/something bad/))
        .then(function () {
          done(new Error('expected error'))
        })
        .catch(function (err) {
          expect(err).to.equal(err)
          done()
        })
        .catch(done)
    })

    it('should not ignore undefined error if regex doesn\'t match', function (done) {
      var ignore = createIgnore()
      var err = undefined
      Promise
        .reject(err)
        .catch(ignore(/something bad/))
        .then(function () {
          done(new Error('expected error'))
        })
        .catch(function (err) {
          expect(err).to.equal(err)
          done()
        })
        .catch(done)
    })

    it('should not ignore errors if string code doesn\'t match', function (done) {
      var ignore = createIgnore()
      var err = new Error('boom')
      err.code = 'nomatch'
      Promise
        .reject(err)
        .catch(ignore('INVALID_FOO'))
        .then(function () {
          done(new Error('expected error'))
        })
        .catch(function (err) {
          expect(err).to.equal(err)
          done()
        })
        .catch(done)
    })

    it('should not ignore errors if string custom code doesn\'t match', function (done) {
      var ignore = createIgnore('custom')
      var err = new Error('boom')
      err.custom = 'nomatch'
      Promise
        .reject(err)
        .catch(ignore('INVALID_FOO'))
        .then(function () {
          done(new Error('expected error'))
        })
        .catch(function (err) {
          expect(err).to.equal(err)
          done()
        })
        .catch(done)
    })

    it('should not ignore errors if number code doesn\'t match', function (done) {
      var ignore = createIgnore()
      var err = new Error('boom')
      err.code = 1
      Promise
        .reject(err)
        .catch(ignore(100))
        .then(function () {
          done(new Error('expected error'))
        })
        .catch(function (err) {
          expect(err).to.equal(err)
          done()
        })
        .catch(done)
    })

    it('should not ignore errors if custom number code doesn\'t match', function (done) {
      var ignore = createIgnore('statusCode')
      var err = new Error('boom')
      err.statusCode = 1
      Promise
        .reject(err)
        .catch(ignore(100))
        .then(function () {
          done(new Error('expected error'))
        })
        .catch(function (err) {
          expect(err).to.equal(err)
          done()
        })
        .catch(done)
    })

    it('should not ignore errors if object doesn\'t match', function (done) {
      var ignore = createIgnore()
      var err = new Error('boom')
      err.foo = 'f'
      err.bar = 'b'
      Promise
        .reject(err)
        .catch(ignore({ foo: 'foo', bar: 'bar' }))
        .then(function () {
          done(new Error('expected error'))
        })
        .catch(function (err) {
          expect(err).to.equal(err)
          done()
        })
        .catch(done)
    })

    it('should not ignore errors if class doesn\'t match', function (done) {
      var ignore = createIgnore()
      var err = new Error('boom')
      Promise
        .reject(err)
        .catch(ignore(CustomError))
        .then(function () {
          done(new Error('expected error'))
        })
        .catch(function (err) {
          expect(err).to.equal(err)
          done()
        })
        .catch(done)
    })

    it('should not ignore errors if function doesn\'t match', function (done) {
      var ignore = createIgnore()
      var err = new Error('boom')
      Promise
        .reject(err)
        .catch(ignore(function () {
          return false
        }))
        .then(function () {
          done(new Error('expected error'))
        })
        .catch(function (err) {
          expect(err).to.equal(err)
          done()
        })
        .catch(done)
    })

    it('should error if tests is not string, number, regexp, object, class or function', function (done) {
      var ignore = createIgnore()
      expect(function () {
        ignore([[]])
      }).to.throw(/ignore-error tests/)
      done()
    })
  })
})