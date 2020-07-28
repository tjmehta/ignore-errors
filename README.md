# ignore-errors [![Build Status](https://travis-ci.org/tjmehta/ignore-errors.svg?branch=master)](https://travis-ci.org/tjmehta/ignore-errors)

Easily ignore specific promise errors

# Installation

```bash
npm i --save ignore-errors
```

# Usage

### Supports both ESM and CommonJS

```js
// esm
import ignore from 'ignore-errors'
// commonjs
const ignore = require('ignore-errors').default
```

### Ignore errors that have a specific property value

Will ignore errors w/ property `foo` that equals the given literal value (string, number, anything except a regexp)

```js
import ignore from 'ignore-errors'

const err = new Error('boom')
err.foo = 'foobar'
await Promise.reject(err).catch(ignore('foo', 'foobar'))
// gets here, no error thrown
```

### Ignore errors have specified properties with values

Will ignore errors w/ 'foo' and 'bar' given expected values

```js
import ignore from 'ignore-errors'

var err = new Error('boom')
err.foo = 1
err.bar = 2
await Promise.reject(err).catch(ignore({ foo: 1, bar: 2 }))
// gets here, no error thrown
```

### Ignore errors have with property values that match a regexp

Will ignore errors w/ property `foo` that have a value that matches the regexp

```js
import ignore from 'ignore-errors'

const err = new Error('boom')
err.foo = 'foobar'
await Promise.reject(err).catch(ignore('foo', /foobar/))
// gets here, no error thrown

// regexps work when passed when matching multiple properties too
const err = new Error('boom')
err.foo = 1
err.bar = 2
await Promise.reject(err).catch(ignore({ foo: /1/, bar: /2/ }))
```

### Convenience methods for common error properties

Easily ignore errors with `messages`, `names`, `statuses`, `reasons` or `codes`

```js
import {
  ignoreMessage,
  ignoreName,
  ignoreStatus,
  ignoreReason,
  ignoreCode,
} from 'ignore-errors'

let err

// ignore errors with specific messages
err = new Error('boom')
await Promise.reject(err).catch(ignoreMessage('boom'))
await Promise.reject(err).catch(ignoreMessage(/boom/))
// gets here, no error thrown

// ignore errors with specific names
class SpecialError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
  }
}
err = new SpecialError('boom')
await Promise.reject(err).catch(ignoreName('SpecialError'))
await Promise.reject(err).catch(ignoreName(/SpecialError/))
// gets here, no error thrown

// ignore errors with specific statuses
err = new Error('boom')
err.status = 500
await Promise.reject(err).catch(ignoreStatus(500))
await Promise.reject(err).catch(ignoreStatus(/500/))
// gets here, no error thrown

// ignore errors with specific reasons
err = new Error('boom')
err.reason = 'BOOM_ERROR'
await Promise.reject(err).catch(ignoreReason('BOOM_ERROR'))
await Promise.reject(err).catch(ignoreReason(/BOOM_ERROR/))
// gets here, no error thrown

// ignore errors with specific codes
err = new Error('boom')
err.code = 10
await Promise.reject(err).catch(ignoreCode(10))
await Promise.reject(err).catch(ignoreCode(/10/))
// gets here, no error thrown
```

### Easily ignore various types of errors with `ignoreAny`

```js
import {
  ignoreAny,
  ignoreMessage,
  ignoreName,
  ignoreStatus,
  ignoreReason,
  ignoreCode,
} from 'ignore-errors'

let err

// ignore errors with specific messages
err = new Error('boom')
await Promise.reject(err).catch(
  ignoreAny(
    ignoreMessage('boom'), 
    ignoreMessage('bam'), 
    ignoreMessage('pow')
  )
)
// gets here, no error thrown
```

# License

MIT
