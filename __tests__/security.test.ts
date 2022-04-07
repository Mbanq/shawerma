import Security from '../src/security'

describe(`Security`, () => {
  it(`Default SECURITY setting is true`, () => {
    const expected = true
    expect(Security()).toEqual(expected)
  })

  it(`Set process.env.SECURITY to false to disable it`, () => {
    process.env.SECURITY = 'false'
    expect(Security()).toEqual(false)
  })
})
