const html = require('choo/html')
const sf = require('sheetify')
const cuid = require('cuid')
const Clipboard = require('clipboard')

sf('../node_modules/normalize.css/normalize.css', {global: true})
sf('../css/clipboard.css', {global: true})

const mainStyle = sf`
  :host {
    width: 360px;
    height: 360px;
    margin: calc(50vh - 180px) auto 0;
  }
  :host input {
    width: 100%;
  }
  input {
    color: #0000ee;
  }
  a {
    color: black;
    text-decoration: none;
    font-weight: bold;
  }
  a:hover {
    text-decoration: underline;
  }
  a.github::before{
    content: '';
    background: url(../vendor/github.png) no-repeat;
    background-size: 10px;
    display: inline-block;
    width: 12px;
    height: 10px;
    margin-left: 2px;
  }
`

module.exports = core => (state, prev, send) => {
  document.addEventListener('DOMContentLoaded', () => {
    new Clipboard('.btn') // eslint-disable-line
  })

  if (state.dashboard.open) {
    setTimeout(() => send('chessboard:renewPieceHandlers'), 500)
    send('location:setLocation', {location: state.dashboard.open})
  }

  if (!state.dashboard.connectionId) {
    send('dashboard:setConnectionId', cuid())
    send('dashboard:awaitPeer', state.dashboard.connectionId)
  }

  return html`<main class="${mainStyle}">
      <h1>Hyperchess!</h1>
      <p>Start a game by sending this link to your friend:</p>
      <p>
        <div class="input-group">
          <input type=text id=connection-id
            ${!state.dashboard.connectionId ? 'disabled' : 'readonly'}
            value="${window.location.protocol + '//' + core.url + '/#/join/' +
              state.dashboard.connectionId}"
          >
          <span class="input-group-button">
            <button class="btn" data-clipboard-target=#connection-id>
              <img class="clippy" src=vendor/clippy.svg alt="Copy to clipboard">
            </button>
          </span>
        </div>
      </p>
      <p style="border-top: 1px dashed grey; padding-top: 12px;">
        <small>Code on <a class="github" href=https://github.com/pguth/hyperchess>Github</a>.</small>
      </p>
    </main>
  `
}
