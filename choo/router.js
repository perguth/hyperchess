module.exports = core => route => [
  route('/', require('../views/board.js')(core))
]
