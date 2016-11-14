const Draggable = require('draggable')
const convert = require('./convert')

module.exports = function dragify (elem, core, send, done) {
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

      // send('removeHighlighting', null, err => err && done(err))
      if (!convert.moveToNotation(src, dest, core)) {
        console.log('move not possible')
        returnToPreviousPosition(elem)
        return
      }

      previousPosition = null
      send('chessboard:sendMove', {src, dest}, err => {
        if (err) {
          returnToPreviousPosition(elem)
          return
        }
      })
    },

    filterTarget: elem => {
      keepPreviousPosition(elem)
      // send('highlightPossibleMoves', elem, err => err && done(err))
      return true
    }
  }
  return new Draggable(elem, options) // eslint-disable-line
}
