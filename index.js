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
var effects = require('./choo/effects')(core)
var reducers = require('./choo/reducers')(core)
var subscriptions = require('./choo/subscriptions')(core)
var state = {
  board: require('./board.json'),
  possibleMoves: []
}
window.state = state

var model = { effects, reducers, subscriptions, state }

app.model(model)
app.router(router)

var cooTree = app.start()
document.body.appendChild(cooTree)
