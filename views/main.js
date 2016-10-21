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
    cursor: -webkit-grab;
  }
`
var darkFieldStyle = sf`
  :host {
    background-color: #cf8b4d !important;
  }
`

function renderCols (row, state) {
  return cols.map((col, i) => {
    let genLi = elem => html`<li
      class="${(i + (row % 2 === 0 ? 1 : 0)) % 2 === 0
        ? darkFieldStyle
        : ''}">
      ${elem}
    </li>`
    if (!state.board[row][col]) return genLi()

    let type = state.board[row][col].type
    let color = state.board[row][col].color
    return html`${genLi(html`<img
      data-position=${col}-${row}
      data-type=${type}
      data-color=${color}
      src=pieces/${type}-${color}.svg
    >`)}`
  })
}

module.exports = (state, prev, send) => html`
  <section class=${boardStyle}>
    <ol reversed class=${rowStyle}>
      ${rows.map(row => html`
        <li>
          <ol class=${colStyle}>
            ${renderCols(row, state)}
          </ol>
        </li>
      `)}
    </ol>
  </section>
`
