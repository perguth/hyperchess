module.exports = {
  isMovePossible: (src, dest, core) => {
    let gameState = core.game.getStatus()
    let allPossibleMoves = gameState.notatedMoves
    let algName = square => square.file + square.rank

    for (let move in allPossibleMoves) {
      let candidate = {
        src: algName(allPossibleMoves[move].src),
        dest: algName(allPossibleMoves[move].dest)
      }
      if (candidate.src !== src) continue
      if (candidate.dest !== dest) continue
      return true
    }
    return false
  }
}
