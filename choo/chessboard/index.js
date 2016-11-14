module.exports = core => ({
  namespace: 'chessboard',
  effects: require('./effects')(core),
  reducers: require('./reducers')(core),
  state: {
    gameId: null,
    board: require('./board.json'),
    highlighted: []
  }
})
