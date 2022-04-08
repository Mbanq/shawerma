# shawerma [ ![Codeship Status for igorkosta/shawerma](https://app.codeship.com/projects/4b87d650-b721-0135-8837-0243d1ced2de/status?branch=master)](https://app.codeship.com/projects/258751) [![npm version](https://badge.fury.io/js/shawerma.svg)](https://badge.fury.io/js/shawerma)

<p align="center">
  <img src="./shawerma.png" />
</p>

Since we're extensively using `AWS λ`, we thought that we need a bunch of
helpers that we can reuse in all our customer facing `λ`-based API.

For now we only support unified `http error` objects, `http responses` and some
`console.log()` based logging that was heavily inspired by the guys from [yubl](https://www.crunchbase.com/organization/yubl)
(they went out of business).

```js
const { log, HttpError, Response } = require('shawerma');

// or by using import

import { log, HttpError, Response } from 'shawerma';
```

Since this version of `shawerma` supports `typescript` you can also import types by doing the following:

```js
const { HttpErrorType, ResponseType } = require('shawerma')

// or by using import

import { HttpErrorType, ResponseType } from 'shawerma';
```

## HTTP Error
`HttpError` is used to create an error response that will be passed to
a callback.

`HttpError` function will take up to 3 arguments:
* statusCode (defaults to 404)
* message (defaults to 'Not Found')
* cors (defaults to `true`)

```js
const HttpError = (statusCode, message, cors = true)
```

To create a `Not authorized` error response with a `401` http status code
you would do something like this:

```js
const errorResponse = HttpError(401, `You shall not pass`);
```

If you don't provide a third `cors` argument, `HttpError` will add a `cors` header to your response `{ 'Access-Control-Allow-Origin': '*' }`

If you don't want your responses `cors`-ified pass `false` a 3rd argument.

An `HttpError` will return a `json` object with following structure:

```js
return {
  statusCode,
  body: JSON.stringify({
    statusCode,
    message
  }),
  headers
};
```

An API response will look like following:

```json
{
  "statusCode": 401,
  "message": "Not authorized"
}
```

`HttpError` provides default values for all function parameters:

```js
const errorResponse = HttpError();

// will return following json object

{
  statusCode: 404,
  body: '"Not Found"',
  headers: { 'Access-Control-Allow-Origin': '*', Vary: 'Origin' }
}
```

## Response
By using `Response` function, you can create a standardized API response.
`Response` takes 3 arguments:

* statusCode
* data (defaults to `null`) - it allows you to create a `No Content` responses
* cors (defaults to `true`)

```js
const response = Response(201, `{'foo':'bar'}`);
```

If you don't provide a third `cors` argument, `Response` will add a `cors` header to your response `{ 'Access-Control-Allow-Origin': '*' }`

If you don't want your responses `cors`-ified pass `false` a 3rd argument.

```js
const response = Response(201, `{'foo':'bar'}`, true);
```

`Response` provides default values for most of the function parameters:

```js
const response = Response();

// response would have following structure
{
  statusCode: 200,
  headers: {
    // cors related and other headers
  }
}
```

A `Response` will return a `json` object with following structure:

```js
return {
  statusCode,
  body: JSON.stringify({
    statusCode,
    data
  }),
  headers
}

// body will be ommited if nothing is passed to the Response function
```

If you pass the `data` argument, `shawerma` will wrap it in an `Array` if it's not one already.
We want to have the consistent outcome, so that we can always use the same `components` on the frontend.

If you want to create a `No Content` response, e.g. as a result of a `DELETE`
action, just pass the `statusCode` to the `Response` function, like this:

```js
const response = Response(204);
```

What you will get back is a `204 NO CONTENT` response.

With `data` passed in an API response will look like following:

```json
{
  "statusCode": 200,
  "data": [
    {
      "foo":"bar"
    },
    {
      "koo":"rra"
    }
  ]
}
```

## Log
`log` wraps `console.log` by adding the information about `log` level to it:
* `log.info(args)` - would return `INFO args`
* `log.warn(args)` - would return `WARN args`
* `log.error(args)` - would return `ERROR args`
* `log.debug(args)` - would return `DEBUG args`

`log.debug()` will be ignored if `env` variable `DEBUG_LOGGING` is not set or set to `false`

## Handler
`createHandler` function takes a function you want to run and an optional
`options` array and returns a `handler` function for your `λ`, e.g.

```js
const createHandler = require('shawerma').createHandler;

createHandler(f, options)

f(event) => result || Promise<result>

options : { timeout, onSuccess, onError }
```

`timeout` defaults to 5 seconds.

The optional `onSuccess` function is called (with the result from `f`) after `f` has returned a result and before the result is returned to API Gateway.

The optional `onError` function is called (with the error object) before the error is returned to API Gateway.

```js
const createHandler = require('shawerma').createHandler;
const listAll = require('./listAll')

const options = {
  timeout: 9000
}

// options is an optional parameter :)
module.exports.handler = createHandler(listAll, options)
```

> IMPORTANT: whenever you create your handler with the help of `createHandler` it will check whether a user calling your function is authenticated (`event.requestContext.authorizer`) or not and whether the request is coming from the allowed `origin` (`event.headers.origin !== process.env.ORIGIN`).

Those checks are not optional yet - they will be in the future.

```js
if (!Cors.checkOrigin(event)) {
  let response = HttpError(403, `Wrong Origin`)
  return cb(null, response)
}

if (!event.requestContext.authorizer) {
  let result = HttpError(401, `Not authorized`)
  return cb(null, result)
}
```

### Cors
`Cors` exports two functions:
- `validOrigins` uses `process.env.ORIGIN` string to create an array of valid `origins`
- `checkOrigin` takes an `event` and returns whether the `event.headers.origin` is one of the allowed origins

If you want to restrict the `CORS origins` you have to define
a `process.env.ORIGIN`.
process.env.ORIGIN can be a string containing multiple `origins` that you want
to allow for `CORS`, e.g. in `env.yml`

```
ORIGIN: http://localhost:8080, http://0.0.0.0:8080, https://eat-more-shawerma.com
```

If no `ORIGIN` is defined, `shawerma` will assume `Access-Control-Allow-Origin: '*'`

In order to control whether your lambda will check for CORS or not, you can use
set the env variable `CORS` to either `true` or `false`.

Setting `CORS: false` will allow requests from any origins.

### Security
> Important: Security related headers are set by default. In case you want to disable security related response headers, you can do so by
setting the environment variable `SECURITY: false`.

Security headers will will take the `ORIGIN` settings into account.
