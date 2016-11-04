let Draggable = require('draggable')

function getArithemticPosition (coords, state) {
  return window.hyperchess.files[coords.x / 45] + window.hyperchess.ranks[coords.y / 45]
}
function isMovePossible (src, dest) {
  let gameState = window.hyperchess.engine.getStatus()
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
function findNotationForMove (src, dest) {
  let gameState = window.hyperchess.engine.getStatus()
  let allPossibleMoves = gameState.notatedMoves

  for (let move in allPossibleMoves) {
    let pSrc = allPossibleMoves[move].src
    if (pSrc.file + pSrc.rank !== src) continue
    let pDest = allPossibleMoves[move].dest
    if (pDest.file + pDest.rank !== dest) continue
    return move
  }
  return null
}

module.exports = {
  move: (move, state, send) => {
    // let move = findNotationForMove(data.src, data.dest)
    console.log('move', move)
    window.hyperchess.engine.move(move)
    send('showMove')
  },
  highlightPossibleMoves: (data, state, send, done) => {
    let position = data.getAttribute('data-position')
    let draggable = document.querySelectorAll(`[data-position=${position}] img`)[0]
    let gameState = window.hyperchess.engine.getStatus()
    let allPossibleMoves = gameState.notatedMoves

    let possibleMoves = []
    for (let move in allPossibleMoves) {
      let src = allPossibleMoves[move].src
      let dest = allPossibleMoves[move].dest
      if (src.file + src.rank === position) possibleMoves.push(dest.file + dest.rank)
    }
    possibleMoves.forEach(move => {
      let elem = document.querySelectorAll(`[data-position=${move}]`)[0]

      let classes = elem.className + ' ' || ''
      elem.className = classes + 'highlighted'

      draggable.addEventListener('mouseup', event => {
        send('removeHighlighting', null, err => err && done(err))
      }, false)
    })
  },
  removeHighlighting: (data, state, send, done) => {
    document.querySelectorAll('.highlighted').forEach(elem => {
      elem.className = elem.className.replace('highlighted', '')
    })
  },
  makeDraggable: (data, state, send, done) => {
    let previousPosition = {}
    function keepPreviousPosition (elem) {
      previousPosition = {left: elem.style.left, top: elem.style.top}
    }
    function returnToPreviousPosition (elem) {
      elem.style.top = previousPosition.top
      elem.style.left = previousPosition.left
    }

    let options = {
      grid: 45,
      smoothDrag: true,
      useGPU: true,
      limit: {x: [1 - 23, 360 - 45 + 22], y: [1 - 23, 360 - 45 + 20]},
      setPosition: true,

      onDragStart: (elem, x, y, event) => {
        keepPreviousPosition(elem)
        let classes = elem.className + ' ' || ''
        elem.className = classes + 'dragging'
      },
      onDragEnd: (elem, x, y, event) => {
        let classes = elem.className
        elem.className = classes.replace('dragging', '')

        let src = elem.getAttribute('data-position')
        let dest = getArithemticPosition({x, y}, state)
        console.log(src, dest, isMovePossible(src, dest))
        if (!isMovePossible(src, dest)) {
          returnToPreviousPosition(elem)
          return
        }
        send('move', {
          src: elem.getAttribute('data-position'),
          dest: getArithemticPosition({x, y}, state)
        }, err => {
          if (err) {
            returnToPreviousPosition(elem)
            return
          }
          send('makeDraggable', getArithemticPosition({x, y}, state), err => err && done(err))
        })
      },
      filterTarget: elem => {
        send('highlightPossibleMoves', elem, err => err && send(err))
        return true
      }
    }
    let piece = document.querySelectorAll(`[data-position=${data}] img`)[0]
    if (piece) piece = new Draggable(piece, options)
  }
}
