var choo = require('choo')
var app = choo()

var chess = require('chess')
var hyperlog = require('hyperlog')
var memdb = require('memdb')

var core = {
  log: hyperlog(memdb()),
  lastEntry: null,
  game: chess.create(),
  pieceHandlers: []
}

var router = require('./choo/router')(core)
var effects = require('./choo/chessboard/effects')(core)
var reducers = require('./choo/chessboard/reducers')(core)
var subscriptions = require('./choo/chessboard/subscriptions')(core)
var state = {
  board: require('./choo/chessboard/board.json'),
  highlighted: []
}
window.state = state

var model = { namespace: 'chessboard', effects, reducers, subscriptions, state }

app.model(model)
app.router('/chessboard', router)

var cooTree = app.start({hash: true})
document.body.appendChild(cooTree)
