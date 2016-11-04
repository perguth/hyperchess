module.exports = {
  'showMove': (data, state) => {
    return Object.assign({}, state, {squares: window.hyperchess.engine.getStatus().board.squares})
  }
}
