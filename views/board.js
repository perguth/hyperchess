const html = require('choo/html')
const sf = require('sheetify')
const convert = require('../lib/convert')
const dragify = require('../lib/dragify')
sf('../node_modules/normalize.css/normalize.css', {global: true})

const boardStyle = sf`
  :host {
    position: relative;
    width: 360px;
    height: 360px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column-reverse;
    margin: calc(50vh - 180px) auto 0;
    border: 1px solid grey;
    line-height: 0;
  }
  :host {
    border-bottom: 2px solid grey;
  }
  :host > div {
    height: 45px;
    width: 45px;
    background-color: #fecda1;
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

module.exports = core => (state, prev, send) => {
  return html`
    <div class="${boardStyle}">
      ${Object.keys(state.board).map((key, i) => {
        let piece = state.board[key]
        let flip = (i + Math.floor(i / 8) % 2) % 2 === 0
        let movePossible = state.possibleMoves.indexOf(i + 1) !== -1
        let draggable
        return html`
          <div class="${flip ? 'dark' : null} ${movePossible ? 'highlighted' : null}">
            <span style="color: white;">${i}</span>
            ${piece ? html`<img
              onload=${elem => setTimeout(() => {
                draggable = dragify(elem, core, send)
              }, 70)}
              onunload=${elem => draggable.destroy()}
              data-position=${convert.numToAlg(i)}
              data-type=${piece.type}
              data-color=${piece.color}
              src=pieces/${piece.type}-${piece.color}.svg>` : null}
          </div>
        `
      })}
    </div>
  `
}
