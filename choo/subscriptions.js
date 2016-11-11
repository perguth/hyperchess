const convert = require('../lib/convert')
const dragify = require('../lib/dragify')

module.exports = core => [
  function chess (send, done) {
    var gameEvents = core.game.game.board

    gameEvents.on('move', move => {
      console.log('move', move)
      var moveValid = typeof move === 'object'
      if (!moveValid) return

      let type = move.postSquare.piece.type
      let color = move.postSquare.piece.side.name
      let src = move.prevSquare.file + move.prevSquare.rank
      let dest = move.postSquare.file + move.postSquare.rank

      send('clearSquare', {src}, err => err && done(err))
      send('setSquare', {dest, type, color},
        err => err && done(err))
    })

    // setTimeout(() => send('makeMove', {src: 'd2', dest: 'd4'}, err => err && console.log(err)), 700)
  },
  function hyperlog (send, done) {
    var hyperlogEvents = core.log.createReadStream({
      live: true, valueEncoding: 'json'
    })

    hyperlogEvents.on('data', node => {
      if (node.value.who !== 'me') {
        send('makeMove', node.value, err => err && done(err))
      }
    })
  },
  function documentReady (send, done) {
    document.addEventListener('DOMContentLoaded', () => {
      // send('makeDraggable', 'd2', err => err && done(err))
      let pieces = document.querySelectorAll(`img.piece`)
      pieces.forEach(piece => {
        core.pieceHandlers.push(dragify(piece, core, send))
      })
    }, false)
  }
]
