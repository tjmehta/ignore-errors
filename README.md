# ignore-errors
Easily ignore specific errors. Works well w/ Promises.

# Installation
```bash
npm i --save ignore-errors
```

# Usage
### Ignore errors by regex.
Will ignore errors w/ `message`s that match regex
```js
var ignore = require('ignore-errors')()

// Ignore errors by regex
// This will ignore errors with `message`'s that pass
var err = new Error('something bad')
Promise
  .reject(err)
  .catch(ignore(/something bad/))
  .then(function () {
    // gets here
  })
```

### Ignore errors by strings or numbers.
Will ignore errors w/ `code`s (or custom key) that match regex
```js
var ignore = require('ignore-errors')()

// Ignore errors w/ "code"
// By default, literals will check to match `err.code`
err = new Error('boom')
err.code = 'INVALID_FOO'
Promise
  .reject(err)
  .catch(ignore('INVALID_FOO'))
  .then(function () {
    // gets here
  })
err = new Error('boom')
err.code = 10
Promise
  .reject(err)
  .catch(ignore(10))
  .then(function () {
    // gets here
  })
// To specify custom code key
var ignoreStatusCodes = require('ignore-errors')('statusCode') // supports keypaths
err = new Error('boom')
err.statusCode = 404
Promise
  .reject(err)
  .catch(ignoreStatusCodes(404))
  .then(function () {
    // gets here
  })
```

### Ignore errors by objects.
Will ignore errors that have those properties (supports keypaths)
```js
var ignore = require('ignore-errors')()

// Ignore errors w/ custom properties
err = new Error('boom')
err.statusCode = 404
Promise
  .reject(err)
  .catch(ignore({ name: 'hello' }))
  .then(function () {
    // gets here
  })
```

### Ignore errors by classes.
Will ignore errors that are instances of those classes
```js
var ignore = require('ignore-errors')()

// Ignore errors by class (checks for es6 classes or capitalized function names)
err = new CustomError('boom')
Promise
  .reject(err)
  .catch(ignore(CustomError))
  .then(function () {
    // gets here
  })
```

### Ignore errors by functions.
Will ignore errors that pass any of the functions (returns true)
```js
var ignore = require('ignore-errors')()

// Ignore errors by a custom test
var customTest = function (err) {
  return (err.a + err.b) === 2
}
err = new Error('boom')
err.a = 1
err.b = 1
Promise
  .reject(err)
  .catch(ignore(customTest))
  .then(function () {
    // gets here
  })

// Ignore multiple errors w/ variety of tests using an Array
err = new Error('boom')
err.a = 1
err.b = 1
Promise
  .reject(err)
  .catch(ignore([/foo msg/, 100, 'INVALID_FOO', CustomError, customTest]))
  .then(function () {
    // gets here
  })
```

# License
MIT