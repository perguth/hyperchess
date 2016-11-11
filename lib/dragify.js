const Draggable = require('draggable')
const convert = require('./convert')
const chess = require('./chess')

module.exports = function makeDraggable (elem, core, send) {
  let previousPosition = {}
  function keepPreviousPosition (elem) {
    previousPosition = {
      top: elem.style.top,
      left: elem.style.left,
      algebraic: elem.getAttribute('data-position')
    }
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
      elem.className = elem.className + ' dragging'
    },

    onDragEnd: (elem, x, y, event) => {
      let classes = elem.className
      elem.className = classes.replace('dragging', '')

      let src = elem.getAttribute('data-position')
      let dest = convert.pxToAlg(x, y)
      console.log(src, dest)

      if (!chess.isMovePossible(src, dest, core)) {
        console.log('not possible')
        returnToPreviousPosition(elem)
        return
      }

      previousPosition = null
      send('makeMove', {src, dest}, err => {
        if (err) {
          returnToPreviousPosition(elem)
          return
        }
        // send('makeDraggable', getArithemticPosition(x, y), err => err && done(err))
      })
    },

    filterTarget: elem => {
      keepPreviousPosition(elem)
      // send('highlightPossibleMoves', elem, err => err && send(err))
      return true
    }
  }
  return new Draggable(elem, options) // eslint-disable-line
}
