function cp (state) {
  return Object.assign({}, state)
}
function positionMap (pos) {
  var a = pos.charCodeAt(0) - 97 + 1
  var b = +pos[1]
  return a * 8 + b
}

module.exports = core => ({
  clearSquare: (data, state) => {
    state = cp(state)
    state.board[data] = null
    return state
  },
  setSquare: (data, state) => {
    state = cp(state)
    let piece = {
      type: data.type,
      color: data.color
    }
    state.board[data.position] = piece
    return state
  },
  highlightSquare: (data, state) => {
    state = cp(state)
    state.possibleMoves.push(data)
    return state
  }
})
