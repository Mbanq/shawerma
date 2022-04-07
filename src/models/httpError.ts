import * as Cors from '../cors'

export default (
  statusCode: number = 404,
  message: string = 'Not Found',
  cors = true
): {
  statusCode: number,
  body: string,
  headers: any
} => {
  let headers = {}

  if (cors) {
    headers = {
      'Access-Control-Allow-Origin': Cors.internals.origin,
      'Vary': 'Origin'
    }
  }

  return {
    statusCode,
    body: JSON.stringify(message),
    headers
  }
}
