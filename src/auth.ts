export default (): boolean => {
  let auth = true

  if (process.env.AUTH === 'false') {
    auth = false
  }

  return auth
}
