const webrtcSwarm = require('webrtc-swarm')
const signalhub = require('signalhub')
const cuid = require('cuid')

module.exports = core => ({
  awaitPeer: (_, state, send, done) => {
    send('dashboard:setOwnId', cuid(), err => err && done(err))
    core.hub = signalhub(state.connectionId, core.signalhubUrl)
    core.swarm = webrtcSwarm(core.hub)

    core.swarm.on('peer', peer => {
      send('dashboard:open', '/chessboard', err => err && done(err))
      send('chessboard:subscribeToHyperlog', null, err => err && done(err))
      send('chessboard:subscribeToChess', null, err => err && done(err))
      send('chessboard:replicateLogs', peer, err => err && done(err))
    })
    core.swarm.on('disconnect', peer => console.log('peer disconnected', peer))
  },
  getOwnId: (_, state, __, done) => {
    done(state.ownId)
  }
})
