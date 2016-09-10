var html = require('choo/html')

module.exports = (state, prev, send) => html`
  <div>${[1, 2, 3, 4, 5, 6, 7, 8].map(elem => html`hi! `)}</div>
`
