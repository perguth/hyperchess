const cuid = require('cuid')

module.exports = core => ({
  namespace: 'dashboard',
  effects: require('./effects')(core),
  reducers: require('./reducers')(core),
  state: {
    connectionId: null,
    ownId: null
  }
})
