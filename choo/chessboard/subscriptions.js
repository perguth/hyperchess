const debug = require('debug')('hyperchess')

module.exports = core => [
  function chess (send, done) {
    var gameEvents = core.game.game.board

    gameEvents.on('move', move => {
      var moveValid = typeof move === 'object'
      if (!moveValid) {
        debug('received invalid move', move)
        return
      }

      let type = move.postSquare.piece.type
      let color = move.postSquare.piece.side.name
      let src = move.prevSquare.file + move.prevSquare.rank
      let dest = move.postSquare.file + move.postSquare.rank

      send('chessboard:receiveMove', {src, dest, type, color}, err => err && done(err))
    })

    // setTimeout(() => send('sendMove', {src: 'd2', dest: 'd4'}, err => err && console.log(err)), 700)
  },
  function hyperlog (send, done) {
    var hyperlogEvents = core.log.createReadStream({
      live: true, valueEncoding: 'json'
    })

    hyperlogEvents.on('data', node => {
      if (node.value.who === 'me') {
        console.log('hyperlog: discarding own move')
        return
      }
      send('chessboard:sendMove', node.value, err => err && done(err))
    })
  },
  function documentReady (send, done) {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        send('chessboard:renewPieceHandlers', {}, err => err && done(err))
      }, 100)
    }, false)
  }
]
