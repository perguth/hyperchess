var html = require('choo/html')
var sf = require('sheetify')
var Draggable = require('draggable')
sf('../node_modules/normalize.css/normalize.css', {global: true})

var boardStyle = sf`
  :host {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column-reverse;
    margin: calc(50vh - 180px) auto 0;
    border: 1px solid grey;
    position: relative;
    line-height: 0;
    position: relative;
    width: 360px;
    height: 360px;
  }
  :host {
    border-bottom: 2px solid grey;
  }
  :host > div {
    background-color: #fecda1;
    height: 45px;
    width: 45px;
  }
  :host > div.dark {
    background-color: #cf8b4d;
  }
  :host > div.highlighted {
    background-color: yellow;
  }
  :host > div.highlighted.dark {
    background-color: orange;
  }
  img.dragging {
    cursor: -webkit-grabbing;
    cursor: grabbing;
  }
`

function numToAlg (num) {
  var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  var counter = 0
  num++
  while (num > 8) {
    num -= 8
    counter++
  }
  return files[counter] + num
}

function makeDraggable (data, core) {
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
      //send('highlightPossibleMoves', elem, err => err && send(err))
      return true
    }
  }
  return new Draggable(data, options) // eslint-disable-line
}

module.exports = core => (state, prev, send) => {
  return html`
    <div class="${boardStyle}">
      ${Object.keys(state.board).map((key, i) => {
        let piece = state.board[key]
        let flip = (i + Math.floor(i / 8) % 2) % 2 === 0
        let movePossible = state.possibleMoves.indexOf(i + 1) !== -1
        let draggable
        return html`
          <div class="${flip ? 'dark' : ''} ${movePossible ? 'highlighted' : ''}">
            <span style="color: white;">${i}</span>
            ${piece ? html`<img
              onload=${elem => {
                draggable = makeDraggable(elem, core)
              }}
              onunload=${elem => {
                console.log('destroyed')
                draggable.destroy()
              }}
              data-position=${numToAlg(i)}
              data-type=${piece.type}
              data-color=${piece.color}
              src=pieces/${piece.type}-${piece.color}.svg>` : ''}
          </div>
        `
      })}
    </div>
  `
}
