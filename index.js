var choo = require('choo')
var app = choo()
var chess = require('chess')

var effects = require('./choo/effects')
var reducers = require('./choo/reducers')
var router = require('./choo/router')
var state = {
  board: require('./board.json'),
  game: chess.create(),
  files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ranks: [1, 2, 3, 4, 5, 6, 7, 8],
  whosTurn: () => 'white'
}
var subscriptions = require('./choo/subscriptions')(state)

app.model({state, reducers, subscriptions, effects})
app.router(router)

var cooTree = app.start()
document.body.appendChild(cooTree)
