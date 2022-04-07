import Normalize from '../src/utils/normalize'
import { include, exclude } from '../src/utils/json'
import event from './event'

describe(`utils`, () => {
  it(`Create a normEvent with all headers lowercased`, () => {
    let headers = Object.keys(event.headers)

    const normEvent = Normalize(event)
    const lowercasedHeaders = Object.keys(normEvent.headers)

    expect(headers).not.toEqual(lowercasedHeaders)
    headers = headers.map(h => { return h.toLowerCase() })
    expect(headers).toEqual(lowercasedHeaders)
  })

  it(`Should pluck the provided keys from the json object`, () => {
    const object = {
      'id': 1,
      'foo': 'bar',
      'bar': 'foo',
      'remove': 'me'
    }

    const included = {
      'id': 1,
      'foo': 'bar'
    }

    expect(include(['id', 'foo'], object)).toEqual(included)
  })

  it(`Should exclude the provided keys from the json object`, () => {
    const object = {
      'id': 1,
      'foo': 'bar',
      'bar': 'foo',
      'remove': 'me'
    }

    const excluded = {
      'id': 1,
      'foo': 'bar',
      'bar': 'foo'
    }

    expect(exclude(['remove'], object)).toEqual(excluded)
  })
})
