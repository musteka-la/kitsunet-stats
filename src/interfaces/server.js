'use strict'

const { base } = require('./base')

const debug = require('debug')
const log = debug('kitsunet:telemetry:rpc-server')

exports.server = function server (server, client) {
  return Object.assign(base(), {
    setPeerId: async (peerId) => {
      client.peerId = peerId
      // update network state
      const networkState = server.networkStore.getState()
      networkState.clients[peerId] = {}
      server.networkStore.putState(networkState)
    },
    submitNetworkState: async (clientState) => {
      const peerId = client.peerId
      if (!peerId) return
      if (!server.clients.includes(client)) return
      // update network state
      const networkState = server.networkStore.getState()
      networkState.clients[peerId] = clientState
      server.networkStore.putState(networkState)
    },
    disconnect: async (peerId) => {
      log(`client "${peerId}" sent disconnect request`)
      // let disconnect request complete, before
      // closing the connection to the client,
      // otherwise it will always fail
      setTimeout(() => {
        server.disconnectClient(client)
      }, 100)
    }
  })
}
