var choo = require('choo')
var app = choo()
var chess = require('chess')

var effects = require('./choo/effects')
var reducers = require('./choo/reducers')
var router = require('./choo/router')
var state = {
  gameEngine: chess.create({PGN: true}),
  files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ranks: [1, 2, 3, 4, 5, 6, 7, 8],
  highlighted: []
}
state.gameState = state.gameEngine.getStatus()
state.whosTurn = () => {
  for (let move in state.gameState.notatedMoves) {
    if (state.gameState.notatedMoves[move].src.piece.side.name === 'white') {
      return 'white'
    }
    return 'black'
  }
}
var subscriptions = require('./choo/subscriptions')(state)

app.model({state, reducers, subscriptions, effects})
app.router(router)

var cooTree = app.start()
document.body.appendChild(cooTree)
