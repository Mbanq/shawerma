import * as log from '../src/log'

// const logLevels = ['INFO', 'WARN', 'ERROR', 'DEBUG']
describe(`log`, () => {
  it(`Appends log level to the message`, () => {
    expect(log.info(`Just an info`)).toEqual(console.log(`INFO just an info`))
    expect(log.warn(`Just a warn`)).toEqual(console.log(`WARN just a warn`))
    expect(log.error(`Just an error`)).toEqual(console.log(`ERROR just an error`))
    expect(log.debug(`Just a debug`)).toEqual(console.log(`DEBUG just a debug`))
  })

  it(`Debug mode is enabled`, () => {
    process.env.DEBUG_LOGGING = 'true'
    expect(log.debug(``)).toEqual(console.log('DEBUG LOGGING ENABLED'))
  })
})
