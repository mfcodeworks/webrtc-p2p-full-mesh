const io = require('socket.io')() // create a socket.io server
const SimpleSignalServer = require('simple-signal-server')
const signal = new SimpleSignalServer(io);
const seeds = new Set()

signal.on('discover', (request) => {
  const client = request.socket.id // you can use any kind of identity, here we use socket.id
  seeds.add(client) // keep track of all connected peers
  request.discover(client, { peers: Array.from(seeds) }) // respond with id and list of other peers
})

signal.on('disconnect', (socket) => {
  const client = socket.id
  seeds.delete(client)
})

signal.on('request', (request) => {
  request.forward() // forward all requests to connect
})

console.log('Running p2p demo! Open http://localhost:8000 for client app')
io.listen(8008)
