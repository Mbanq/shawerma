module.exports = {
  plugins: ['node'],
  extends: [
    'standard',
    'plugin:import/typescript'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    node: true,
    jest: true
  }
}
