function cp (state) {
  return Object.assign({}, state)
}

module.exports = core => ({
  clearSquare: (move, state) => {
    state = cp(state)
    state.board[move.src] = null
    return state
  },
  setSquare: (move, state) => {
    state = cp(state)
    let piece = {
      type: move.type,
      color: move.color
    }
    state.board[move.dest] = piece
    return state
  },
  highlight: (move, state) => {
    state = cp(state)
    state.highlighted.push(move.dest)
    return state
  }
})
