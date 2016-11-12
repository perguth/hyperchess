const html = require('choo/html')
const sf = require('sheetify')
sf('../node_modules/normalize.css/normalize.css', {global: true})

module.exports = core => (state, prev, send) => {
  return html`<main>
      <h1>Error, error</h1>
    </main>
  `
}
