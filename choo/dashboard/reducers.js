function cp (state) {
  return Object.assign({}, state)
}

module.exports = core => ({
  setConnectionId: (id, state) => {
    state = cp(state)
    state.connectionId = id
    return state
  },
  open: (what, state) => {
    state = cp(state)
    state.open = what
    return state
  },
  setOwnId: (id, state) => {
    state = cp(state)
    state.ownId = id
    return state
  }
})
