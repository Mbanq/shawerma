// keep the keys that are provided
const include = (keys: Array<any>, obj: any): any => {
  return keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {})
}

// remove all keys except the ones provided
const exclude = (keys: Array<any>, obj: any): any => {
  const keysToKeep = Object.keys(obj).filter((elt) => {
    return !keys.includes(elt)
  })
  return include(keysToKeep, obj)
}

export {
  include,
  exclude
}
