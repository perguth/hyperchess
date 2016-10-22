

module.exports = {
  highlightPossibleMoves: (data, state, send, done) => {
    let piece = data.getAttribute('data-position')
    let allPossibleMoves = state.game.getStatus().notatedMoves

    let possibleMoves = []
    for (let move in allPossibleMoves) {
      let src = allPossibleMoves[move].src
      let dest = allPossibleMoves[move].dest
      if (src.file + src.rank === piece) possibleMoves.push(dest.file + dest.rank)
    }

    console.log(possibleMoves)
  }
}
