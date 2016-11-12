const convert = require('../../lib/convert')
const dragify = require('../../lib/dragify')

module.exports = core => ({
  receiveMove: (move, state, send, done) => {
    send('chessboard:clearSquare', move, err => err && done(err))
    send('chessboard:setSquare', move, err => err && done(err))
  },
  sendMove: (move, state, send, done) => {
    let notatedMove = convert.moveToNotation(move.src, move.dest, core)
    move = core.game.move(notatedMove)
    let moveValid = typeof move === 'object'
    if (!moveValid) done('invalid')

    setTimeout(() => {
      // run after `bel` has rendered
      send('chessboard:renewPieceHandlers', {}, err => err && done(err))
    }, 70)
    send('chessboard:logMove', move.move.algebraic, err => err && done(err))
  },
  logMove: (data, state, send, done) => {
    data = JSON.stringify({
      algebraic: data,
      who: 'me'
    })
    core.log.add(core.lastEntry, data, (err, node) => {
      if (err) done(err)
      core.lastEntry = node.key
    })
  },
  highlightPossibleMoves: (data, state, send, done) => {
    let piece = convert.pxToAlg(data.style.left, data.style.top)
    let allPossibleMoves = core.game.getStatus().notatedMoves
    let res = 'no move possible'

    for (let move in allPossibleMoves) {
      let src = allPossibleMoves[move].src
      let dest = allPossibleMoves[move].dest
      if (src.file + src.rank === piece) {
        res = null
        send('chessboard:highlight', {dest: dest.file + dest.rank}, err => err && done(err))
      }
    }

    done(res)
  },
  renewPieceHandlers: (data, state, send, done) => {
    core.pieceHandlers.forEach(pieceHandler => {
      pieceHandler.destroy()
    })

    core.pieceHandlers = []
    let pieces = document.querySelectorAll(`img.piece`)
    pieces.forEach(piece => {
      core.pieceHandlers.push(dragify(piece, core, send, done))
    })
  }
})
