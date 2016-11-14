module.exports = core => route => [
  route('/', require('../views/dashboard')(core)),
  route('/404', require('../views/error')(core)),
  route('/chessboard', require('../views/chessboard')(core)),
  route('/join', [
    route('/:connectionId', require('../views/chessboard')(core))
  ])
]
