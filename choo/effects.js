module.exports = {
  highlightPossibleMoves: (data, state, send, done) => {
    let position = data.getAttribute('data-position')
    let draggable = document.querySelectorAll(`[data-position=${position}] img`)[0]
    let allPossibleMoves = state.gameState.notatedMoves

    let possibleMoves = []
    for (let move in allPossibleMoves) {
      let src = allPossibleMoves[move].src
      let dest = allPossibleMoves[move].dest
      if (src.file + src.rank === position) possibleMoves.push(dest.file + dest.rank)
    }
    possibleMoves.forEach(move => {
      let elem = document.querySelectorAll(`li [data-position=${move}]`)[0]

      let classes = elem.className + ' ' || ''
      elem.className = classes + 'highlighted'

      draggable.addEventListener('mouseup', event => {
        send('removeHighlighting', null, err => err && done(err))
      }, false)
    })
  },
  removeHighlighting: (data, state, send, done) => {
    document.querySelectorAll('.highlighted').forEach(elem => {
      elem.className = elem.className.replace('highlighted', '')
    })
  }
}
