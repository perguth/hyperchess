function positionMap (pos) {
  var a = pos.charCodeAt(0) - 97
  var b = +pos[1]
  console.log('pos', pos, a * 8 + b - 1)
  return a * 8 + b - 1
}
module.exports = core => [
  function chess (send, done) {
    var gameEvents = core.game.game.board

    gameEvents.on('move', move => {
      console.log('move', move)
      var moveValid = typeof move === 'object'
      if (!moveValid) return

      let type = move.postSquare.piece.type
      let color = move.postSquare.piece.side.name
      let from = move.prevSquare.file + move.prevSquare.rank
      let to = move.postSquare.file + move.postSquare.rank

      send('clearSquare', positionMap(from), err => err && done(err))
      send('setSquare', { position: positionMap(to), type, color }, err => err && done(err))
    })

    //setTimeout(() => send('makeMove', 'd4', err => err && console.log(err)), 1500)
  },
  function hyperlog (send, done) {
    var hyperlogEvents = core.log.createReadStream({
      live: true, valueEncoding: 'json'
    })

    hyperlogEvents.on('data', node => {
      if (node.value.who !== 'me') send('makeMove', node.value, err => err && done(err))
    })
  },
  function documentReady (send, done) {
    document.addEventListener('DOMContentLoaded', () => {
      // send('makeDraggable', 'd2', err => err && done(err))
    }, false)
  }
]
