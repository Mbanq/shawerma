import Promise from 'bluebird'
import * as log from './log'
import normalize from './utils/normalize'
import HttpError from './models/httpError'
import * as Cors from './cors'
import Auth from './auth'

function doNothing () {}

function swallowExn (f: Function, arg: any) {
  try {
    f(arg)
  } catch (err: any) {
    log.error(err.message)
  }
}

export const createHandler = (
  f: typeof Function,
  options: {
    timeout: number,
    onSuccess: Function,
    onError: Function,
    auth: boolean,
    cors: boolean,
    logEvent: boolean
  } = {
    timeout: 5000,
    onSuccess: doNothing,
    onError: doNothing,
    auth: Auth(),
    cors: Cors.enabled(),
    logEvent: true
  }
) => {
  let {
    timeout = 5000,
    onSuccess = doNothing,
    onError = doNothing,
    auth = Auth(),
    cors = Cors.enabled(),
    logEvent = true
  } = options

  return (event: any, context: any, cb: Function) => {
    // create a normalized event
    // where every header is lowercased
    // don't mutate the original event
    const normEvent = normalize(event)
    context.callbackWaitsForEmptyEventLoop = false

    if (logEvent) log.info(JSON.stringify(event, null, 4))

    if (cors && !Cors.checkOrigin(normEvent)) {
      let response = HttpError(403, `Wrong Origin`)
      return cb(null, response)
    }

    if (auth && !event.requestContext.authorizer) {
      let result = HttpError(401, `Not authorized`)
      return cb(null, result)
    }
    const executionStart = process.hrtime()
    // bluebird-fy the fetch results Promise so we can use timeout on it
    Promise
      .resolve(f(normEvent))
      .then((results: any) => {
        log.debug(JSON.stringify(results, null, 4))

        swallowExn(onSuccess, results)
        return cb(null, results)
      })
      .timeout(timeout)
      .catch(Promise.TimeoutError, (err: any) => {
        log.error(`Task timed out after ${timeout} milliseconds: ${err}`)
        let response = HttpError(504, 'timed out')
        return cb(null, response)
      })
      .catch(err => {
        log.warn(`Failed to process request: ${JSON.stringify(event)}`)
        log.error(err.message)

        swallowExn(onError, err)

        if (err.status) {
          return cb(null, JSON.stringify(err))
        } else {
          let response = HttpError(500, `Server error. Request Id [${context.awsRequestId}]`)
          return cb(null, response)
        }
      }).finally(() => {
        const executionEnd = process.hrtime(executionStart)
        log.info(`${f.name} executed in: ${executionEnd[0]}s ${executionEnd[1] / 1000000}ms`)
      })
  }
}
