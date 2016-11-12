module.exports = core => route => [
  // route('/', require('../views/dashboard.js')(core)),
  route('/404', require('../views/error.js')(core)),
  route('/chessboard', require('../views/chessboard.js')(core))
]
