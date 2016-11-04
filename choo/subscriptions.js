module.exports = state => [
  function makeDraggable (send, done) {
    document.addEventListener('DOMContentLoaded', () => {
      window.files.forEach(file => {
        window.ranks.forEach(rank => {
          send('makeDraggable', file + rank, err => err && done(err))
        })
      })
    }, false)
  }
]
