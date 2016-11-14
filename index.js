const choo = require('choo')
const app = choo()
const cuid = require('cuid')

const chess = require('chess')
const hyperlog = require('hyperlog')
const memdb = require('memdb')

var core = {
  url: 'localhost:9966',
  signalhubUrl: 'https://signalhub.perguth.de:65300',
  log: hyperlog(memdb()),
  lastEntry: null,
  game: chess.create(),
  pieceHandlers: []
}

app.model(require('./choo/dashboard/')(core))
app.model(require('./choo/chessboard/')(core))

app.router('/404', require('./choo/router')(core))
const cooTree = app.start({hash: true})

document.body.appendChild(cooTree)
