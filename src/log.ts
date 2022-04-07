const log = (level: string, args: any): void => {
  let debugEnabled = process.env.DEBUG_LOGGING === 'true'

  if (debugEnabled) {
    console.log('DEBUG LOGGING ENABLED')
  }

  if (level === 'DEBUG' && !debugEnabled) {
    return
  }

  return console.log(level, args)
}

// default log(args) to log('INFO', args)

export const info = (args: any): void => log('INFO', args)
export const warn = (args: any): void => log('WARN', args)
export const error = (args: any): void => log('ERROR', args)
export const debug = (args: any): void => log('DEBUG', args)
