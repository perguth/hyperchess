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
      let illegalMove = false

      let options = {
        grid: 45,
        smoothDrag: true,
        useGPU: true,
        limit: {x: [1 - 23, 360 - 45 + 22], y: [1 - 23, 360 - 45 + 20]},

        onDragStart: (elem, x, y, event) => {
          keepPreviousPosition(elem)
          let classes = elem.className + ' ' || ''
          elem.className = classes + 'dragging'
        },
        onDragEnd: (elem, x, y, event) => {
          let classes = elem.className
          elem.className = classes.replace('dragging', '')
          if (illegalMove) {
            returnToPreviousPosition(elem)
            illegalMove = false
          }
        },
        filterTarget: elem => {
          if (state.whosTurn() !== elem.getAttribute('data-color')) {
            illegalMove = true
            return true
          }
          send('highlightPossibleMoves', elem, err => err && send(err))
          return true
        }
      }
      state.files.forEach(file => {
        state.ranks.forEach(rank => {
          let piece = document.querySelectorAll(`[data-position=${file}${rank}] img`)[0]
          if (piece) piece = new Draggable(piece, options)
        })
      })
    }, false)
  }
]
