const html = require('choo/html')
const sf = require('sheetify')
const convert = require('../lib/convert')
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
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      send('chessboard:renewPieceHandlers')
    }, 100)
  }, false)

  if (!state.dashboard.connectionId) {
    let connectionId = state.params.connectionId
    send('dashboard:setConnectionId', connectionId)
    send('dashboard:awaitPeer', connectionId)
  }

  return html`
    <div class="${boardStyle}">
      ${Object.keys(state.chessboard.board).map((key, i) => {
        const piece = state.chessboard.board[key]
        const flip = (i + Math.floor(i / 8) % 2) % 2 === 0
        const highlighted = state.chessboard.highlighted.indexOf(convert.numToAlg(i)) !== -1

        return html`
          <div class="${flip ? 'dark' : null} ${highlighted ? 'highlighted' : null}">
            ${piece ? html`<img class="piece"
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
