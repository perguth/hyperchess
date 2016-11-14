const convert = require('../../lib/convert')
const dragify = require('../../lib/dragify')

module.exports = core => ({
  subscribeToHyperlog: (_, state, send, done) => {
    var hyperlogEvents = core.log.createReadStream({
      live: true, valueEncoding: 'json'
    })

    hyperlogEvents.on('data', node => {
      send('dashboard:getOwnId', null, ownId => {
        if (node.value.who === ownId) {
          return
        }
        let move = core.game.move(node.value.algebraic)
        let moveValid = typeof move === 'object'
        if (!moveValid) done('invalid')
      })
    })
  },
  subscribeToChess: (_, state, send, done) => {
    var gameEvents = core.game.game.board

    gameEvents.on('move', move => {
      var moveValid = typeof move === 'object'
      if (!moveValid) {
        console.log('received invalid move', move)
        return
      }

      let type = move.postSquare.piece.type
      let color = move.postSquare.piece.side.name
      let src = move.prevSquare.file + move.prevSquare.rank
      let dest = move.postSquare.file + move.postSquare.rank

      send('chessboard:showMove', {src, dest, type, color}, err => err && done(err))

      setTimeout(() => {
        // run after `bel` has rendered
        send('chessboard:renewPieceHandlers', {}, err => err && done(err))
      }, 70)
    })

    // setTimeout(() => send('sendMove', {src: 'd2', dest: 'd4'}, err => err && console.log(err)), 700)
  },
  replicateLogs: (peer, state, send, done) => {
    const myStream = core.log.createReplicationStream({live: true})
    myStream.pipe(peer).pipe(myStream)
  },
  showMove: (move, state, send, done) => {
    send('chessboard:clearSquare', move, err => err && done(err))
    send('chessboard:setSquare', move, err => err && done(err))
  },
  sendMove: (move, state, send, done) => {
    let algebraic = move.algebraic || convert.moveToNotation(move.src, move.dest, core)
    move = core.game.move(algebraic)
    let moveValid = typeof move === 'object'
    if (!moveValid) done('invalid')

    send('dashboard:getOwnId', null, ownId => {
      move = JSON.stringify({
        algebraic,
        who: ownId
      })
      core.log.add(core.lastEntry, move, (err, node) => {
        if (err) done(err)
        core.lastEntry = node.key
      })
    })
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
  /*
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
  }, */
})
