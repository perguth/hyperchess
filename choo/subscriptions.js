module.exports = state => [
  function makeDraggable (send, done) {
    document.addEventListener('DOMContentLoaded', () => {
      let Draggable = require('draggable')
      let previousPosition = {}
      function keepPreviousPosition (elem) {
        previousPosition = {left: elem.style.left, top: elem.style.top}
      }
      function returnToPreviousPosition (elem) {
        elem.style.top = previousPosition.top
        elem.style.left = previousPosition.left
      }
      function getPosition (elem) {

      }

      let options = {
        grid: 45,
        smoothDrag: true,
        useGPU: true,
        onDragStart: (elem, x, y, event) => {
          keepPreviousPosition(elem)
          // send('highlightPossibleMoves', getPosition(elem), err => err && send(err))
          let classes = elem.className + ' ' || ''
          elem.className = classes + 'dragging'
        },
        onDragEnd: (elem, x, y, event) => {
          let classes = elem.className
          elem.className = classes.replace('dragging', '')
          returnToPreviousPosition(elem)
        },
        filterTarget: target => {
          return true
        }
      }
      state.rows.forEach(row => {
        state.cols.forEach(col => {
          let piece = document.querySelectorAll(`[data-position=${col}-${row}`)[0]
          if (piece) piece = new Draggable(piece, options)
        })
      })
    }, false)
  }
]
