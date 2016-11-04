var html = require('choo/html')
var sf = require('sheetify')
sf('../node_modules/normalize.css/normalize.css', {global: true})

var boardStyle = sf`
  :host {
    margin: calc(50vh - 180px) auto 0;
    border: 1px solid grey;
    position: relative;
    line-height: 0;
    position: relative;
    width: 360px;
    height: 360px;
  }

  img.dragging {
    cursor: grabbing;
    cursor: -webkit-grabbing;
  }

  ol {
    list-style-type: none;
    display: flex;
    flex-flow: row-reverse wrap;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
  li {
    background-color: #fecda1;
    height: 45px;
    width: 45px;
  }
  .dark {
    background-color: #cf8b4d;
  }
  .highlighted {
    background-color: yellow;
  }
  .highlighted.dark {
    background-color: orange;
  }
`

function renderPiece (square, i, state, send) {
  let piece = square.piece
  if (!piece) return
  let position = square.file + square.rank
  let type = piece.type
  let color = piece.side.name
  return html`<img
    onload=${() => { console.log('test'); send('makeDraggable', position) }}
    data-position=${position}
    data-type=${type}
    data-color=${color}
    src=pieces/${type}-${color}.svg
  >`
}

module.exports = (state, prev, send) => html`
  <div class=${boardStyle}>
    <ol>
      ${state.squares.map((square, i) => {
        let flip = Math.floor(i / 8)
        return html`
          <li class="${(i + flip) % 2 !== 0 ? 'dark' : ''}">
            ${renderPiece(square, i, state, send)}
          </li>
        `
      })}
    </ol>
  </div>
`
