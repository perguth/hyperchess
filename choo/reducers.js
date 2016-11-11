const convert = require('../lib/convert')

function cp (state) {
  return Object.assign({}, state)
}
function positionMap (pos) {
  var a = pos.charCodeAt(0) - 97 + 1
  var b = +pos[1]
  return a * 8 + b
}

module.exports = core => ({
  clearSquare: (move, state) => {
    console.log('clearSquare', move)
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
  highlightSquare: (data, state) => {
    state = cp(state)
    state.possibleMoves.push(data)
    return state
  }
})
