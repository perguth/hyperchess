var html = require('choo/html')
var rows = [8, 7, 6, 5, 4, 3, 2, 1]
var cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
var sf = require('sheetify')
sf('../node_modules/normalize.css/normalize.css', {global: true})

var boardStyle = sf`
  :host {
    width: 360px;
    height: 360px;
    margin: calc(50vh - 180px) auto 0;
    border: 1px solid grey;
    position: relative;
  }

  img.dragging {
    cursor: grabbing;
    cursor: -webkit-grabbing;
  }
`

var rowStyle = sf`
  :host, :host ol {
    margin: 0;
    padding: 0;
    list-style-type: none;
    text-align: center;
    height: 45px;
  }
`

var colStyle = sf`
  li {
    background-color: #fecda1;
    height: 45px;
    width: 45px;
    display: inline-block;
  }
  li img {
    cursor: pointer;
    cursor: grab;
    cursor: -webkit-grab;
  }
  li.dark {
    background-color: #cf8b4d;
  }
  li.highlighted {
    background-color: yellow;
  }
`

function renderFiles (rank, state) {
  return state.files.map((file, i) => {
    let genLi = elem => html`<li
      class="${(i + (rank % 2 === 0 ? 1 : 0)) % 2 === 0
        ? 'dark'
        : ''}">
      ${elem}
    </li>`
    if (!state.board[file][rank]) return genLi()

    let type = state.board[file][rank].type
    let color = state.board[file][rank].color
    return html`${genLi(html`<img
      data-position=${file}${rank}
      data-type=${type}
      data-color=${color}
      src=pieces/${type}-${color}.svg
    >`)}`
  })
}

module.exports = (state, prev, send) => html`
  <section class=${boardStyle}>
    <ol reversed class=${rowStyle}>
      ${state.ranks.reverse().map(rank => html`
        <li>
          <ol class=${colStyle}>
            ${renderFiles(rank, state)}
          </ol>
        </li>
      `)}
    </ol>
  </section>
`
