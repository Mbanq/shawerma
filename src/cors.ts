// think about a proper default
let internals: {
  origin: string | null
} = {
  origin: '*'
}

const enabled = (): boolean => {
  let cors = true

  if (process.env.CORS === 'false') {
    cors = false
  }

  return cors
}

const validOrigins = (): string | Array<string> => {
  const origins = !process.env.ORIGIN ? '*' : Array.from(process.env.ORIGIN.replace(/\s/g, '').split(','))

  return origins
}

const checkOrigin = (event: any): boolean => {
  if (validOrigins() === '*') {
    return true
  }

  // it's `Origin` on aws and `origin` locally
  // we have to solve this problem
  if (validOrigins().includes(event.headers.origin)) {
    internals.origin = event.headers.origin
    return true
  }

  // should we really set it to null
  // and why doesn't it work?
  internals.origin = null
  return false
}

export {
  validOrigins,
  checkOrigin,
  internals,
  enabled
}
