var html = require('choo/html')
var sf = require('sheetify')
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

module.exports = (state, prev, send) => html`
  <div class="${boardStyle}">
    ${state.board.map((piece, i) => {
      let flip = (i + Math.floor(i / 8) % 2) % 2 === 0
      let movePossible = state.possibleMoves.indexOf(i + 1) !== -1
      let draggable
      return html`<div class="${flip ? 'dark' : ''} ${movePossible ? 'highlighted' : ''}"><span style="color: white;">${i}</span>
        ${piece ? html`<img
          onload=${(elem) => {
            draggable = send('makeDraggable', elem)
          }}
          onunload=${(elem) => draggable.destroy()}
          data-position=${numToAlg(i)}
          data-type=${piece.type}
          data-color=${piece.color}
          src=pieces/${piece.type}-${piece.color}.svg>` : ''}
      </div>`
    })}
  </div>
`
