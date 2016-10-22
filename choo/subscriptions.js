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

      let options = {
        grid: 45,
        smoothDrag: true,
        useGPU: true,
        onDragStart: (elem, x, y, event) => {
          keepPreviousPosition(elem)
          let classes = elem.className + ' ' || ''
          elem.className = classes + 'dragging'
        },
        onDragEnd: (elem, x, y, event) => {
          let classes = elem.className
          elem.className = classes.replace('dragging', '')
          // returnToPreviousPosition(elem)
        },
        filterTarget: elem => {
          send('highlightPossibleMoves', elem, err => err && send(err))
          return state.whosTurn() === elem.getAttribute('data-color')
        }
      }
      state.files.forEach(file => {
        state.ranks.forEach(rank => {
          let piece = document.querySelectorAll(`[data-position=${file}${rank}`)[0]
          if (piece) piece = new Draggable(piece, options)
        })
      })
    }, false)
  }
]
