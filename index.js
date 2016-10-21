var choo = require('choo')
var app = choo()

var effects = require('./choo/effects')
var reducers = require('./choo/reducers')
var router = require('./choo/router')
var state = {
  board: require('./board.json'),
  rows: [8, 7, 6, 5, 4, 3, 2, 1],
  cols: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
}
var subscriptions = require('./choo/subscriptions')(state)

app.model({state, reducers, subscriptions, effects})
app.router(router)

var cooTree = app.start()
document.body.appendChild(cooTree)
