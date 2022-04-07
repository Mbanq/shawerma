import * as Cors from '../src/cors'
import event from './event'

process.env.ORIGIN = 'http://localhost:8080, http://127.0.0.1'

describe(`Cors`, () => {
  it(`Creates an array of allowed origins`, () => {
    const expected = ['http://localhost:8080', 'http://127.0.0.1']
    expect(Cors.validOrigins()).toEqual(expected)
  })

  it(`Check if an event has a valid origin`, () => {
    expect(Cors.checkOrigin(event)).toEqual(true)
  })

  it(`Check if an event has a wrong origin`, () => {
    event.headers.origin = 'https://wrong.com'
    expect(Cors.checkOrigin(event)).toEqual(false)
  })

  it(`Check if process.env.ORIGIN: '*'`, () => {
    process.env.ORIGIN = ''
    expect(Cors.checkOrigin(event)).toEqual(true)
  })

  it(`CORS has to be enabled by default`, () => {
    expect(Cors.enabled()).toEqual(true)
  })

  it(`Check if CORS is disabled`, () => {
    // CORS: true is set in the env
    // that's why it's a string and not a boolean
    process.env.CORS = 'false'
    expect(Cors.enabled()).toEqual(false)
  })
})
