const streamView = require('./view.js')

module.exports = route => [
  route('/', streamView)
]
