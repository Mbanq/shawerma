import HttpError from '../src/models/httpError'

describe(`HttpError`, () => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Vary': 'Origin'
  }

  it(`Creates a not authorized error response with CORS using defaults`, () => {
    const notFound = 'Not Found'
    const err = HttpError()
    expect(err.statusCode).toBe(404)
    expect(err.body).toBe(JSON.stringify(notFound))
    expect(err.headers).toEqual(corsHeaders)
  })

  it(`Creates a not authorized error response with CORS`, () => {
    const notAuthorized = 'Not authorized'
    const err = HttpError(401, notAuthorized)
    expect(err.statusCode).toBe(401)
    expect(err.body).toBe(JSON.stringify(notAuthorized))
    expect(err.headers).toEqual(corsHeaders)
  })

  it(`Creates a not authorized error response without CORS`, () => {
    const notAuthorized = 'Not authorized'
    const err = HttpError(401, notAuthorized, false)
    expect(err.statusCode).toBe(401)
    expect(err.body).toBe(JSON.stringify(notAuthorized))
    expect(err.headers).toEqual({})
  })
})
