var Draggable = require('draggable')
const convert = require('../lib/convert')
const dragify = require('../lib/dragify')

module.exports = core => ({
  makeMove: (data, state, send, done) => {
    let notatedMove = convert.toNotatedMove(data.src, data.dest, core)
    let move = core.game.move(notatedMove)
    let moveValid = typeof move === 'object'
    if (!moveValid) done('invalid')

    console.log('made move', move.move.algebraic)
    setTimeout(() => {
      // run after `bel` has rendered
      send('renewPieceHandlers', {}, err => err && done(err))
    }, 70)
    send('logMove', move.move.algebraic, err => err && done(err))
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
    return
    /*
    let piece = getArithemticPosition(data.style.left, data.style.top)
    let allPossibleMoves = core.game.getStatus().notatedMoves

    for (let move in allPossibleMoves) {
      let src = allPossibleMoves[move].src
      let dest = allPossibleMoves[move].dest
      if (src.file + src.rank === piece) {
        send('highlightSquare', dest.file + dest.rank, err => err && done(err))
      }
    }
    */
  },
  makeDraggable: (data, state, send, done) => {
    let previousPosition = {}
    function keepPreviousPosition (elem) {
      previousPosition = {
        left: elem.style.left,
        top: elem.style.top,
        algebraic: elem.getAttribute('data-position')
      }
    }
    function returnToPreviousPosition (elem) {
      elem.style.top = previousPosition.top
      elem.style.left = previousPosition.left
    }
    function isMovePossible (src, dest) {
      let gameState = core.game.getStatus()
      let allPossibleMoves = gameState.notatedMoves

      for (let move in allPossibleMoves) {
        let pSrc = allPossibleMoves[move].src
        if (pSrc.file + pSrc.rank !== src) continue
        let pDest = allPossibleMoves[move].dest
        if (pDest.file + pDest.rank !== dest) continue
        return true
      }
      return false
    }

    let options = {
      grid: 45,
      smoothDrag: true,
      useGPU: true,
      limit: {x: [1 - 23, 360 - 45 + 22], y: [1 - 23, 360 - 45 + 20]},
      setPosition: true,

      onDragStart: (elem, x, y, event) => {
        elem.className = elem.className + ' dragging'
      },

      onDragEnd: (elem, x, y, event) => {
        let classes = elem.className
        elem.className = classes.replace('dragging', '')

        let src = elem.getAttribute('data-position')
        let dest = convert.pxToAlg(x, y)
        console.log(src, dest)

        if (!isMovePossible(src, dest)) {
          console.log('not possible')
          returnToPreviousPosition(elem)
          return
        }

        previousPosition = null
        /*

        send('move', {
          src: elem.getAttribute('data-position'),
          dest: getArithemticPosition(x, y)
        }, err => {
          if (err) {
            returnToPreviousPosition(elem)
            return
          }
          send('makeDraggable', getArithemticPosition(x, y), err => err && done(err))
        })
        */
      },

      filterTarget: elem => {
        keepPreviousPosition(elem)
        send('highlightPossibleMoves', elem, err => err && send(err))
        return true
      }
    }
    done(new Draggable(data, options)) // eslint-disable-line
  },
  renewPieceHandlers: (data, state, send, done) => {
    console.log('renewPieceHandlers')
    core.pieceHandlers.forEach(pieceHandler => {
      pieceHandler.destroy()
    })
    core.pieceHandlers = []
    let pieces = document.querySelectorAll(`img.piece`)
    pieces.forEach(piece => {
      core.pieceHandlers.push(dragify(piece, core, send))
    })
  }
})
