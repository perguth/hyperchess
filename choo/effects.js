var Draggable = require('draggable')

function pxToAlg (left, top, flip) {
  var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  var ranks = [1, 2, 3, 4, 5, 6, 7, 8].reverse()
  console.log('pxToAlg', left, top)
  return files[parseInt(left, 10) / 45] + ranks[parseInt(top, 10) / 45]
}
function positionMap (pos) {
  var a = pos.charCodeAt(0) - 97 + 1
  var b = +pos[1]
  return a * 8 + b
}
function algToNum (alg) {
  var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  return files.indexOf(alg[0]) + +alg[1]
}

module.exports = core => ({
  makeMove: (data, state, send, done) => {
    let move = core.game.move(data)
    let moveValid = typeof move === 'object'
    if (!moveValid) done('invalid')

    console.log('make move', move)
    send('logMove', move.move.algebraic, err => err && done(err))
    done('valid')
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
    let piece = getArithemticPosition(data.style.left, data.style.top)
    let allPossibleMoves = core.game.getStatus().notatedMoves

    for (let move in allPossibleMoves) {
      let src = allPossibleMoves[move].src
      let dest = allPossibleMoves[move].dest
      if (src.file + src.rank === piece) {
        send('highlightSquare', dest.file + dest.rank, err => err && done(err))
      }
    }
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
        let dest = pxToAlg(x, y)
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
  }
})
