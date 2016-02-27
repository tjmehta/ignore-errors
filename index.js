var exists = require('exists')
var hasKeypaths = require('101/has-keypaths')
var instanceOf = require('101/instance-of')
var isRegExp = require('101/is-regexp')
var isObject = require('101/is-object')
var isFunction = require('101/is-function')
var isNumber = require('101/is-number')
var isString = require('101/is-string')
var passAny = require('101/pass-any')

var isClass = require('./lib/is-class.js')

module.exports = createIgnore

function createIgnore (codeKey) {
  codeKey = exists(codeKey) ? codeKey : 'code'

  return function ignore (/* tests */) {
    var args = Array.prototype.slice.call(arguments)
    var tests = args.reduce(function (tests, test) {
      return tests.concat(test)
    }, [])

    tests = tests.map(function (test, i) {
      if (isRegExp(test)) {
        return function (err) {
          return test.test(err && err.message)
        }
      } else if (isString(test) || isNumber(test)) {
        var keys = {}
        keys[codeKey] = test
        return hasKeypaths(keys)
      } else if (isObject(test)) {
        return hasKeypaths(test)
      } else if (isClass(test)) {
        return instanceOf(test)
      } else if (isFunction(test)) {
        return test
      } else {
        throw new TypeError('ignore-error tests must be a regexp, string, number, object, class or function')
      }
    })

    return function (err) {
      if (!passAny.apply(null, tests)(err)) {
        // don't ignore the error
        throw err
      }
    }
  }
}
