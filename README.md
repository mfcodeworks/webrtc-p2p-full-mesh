# WebRTC p2p Full Mesh

## Dependancies
- simple-signal  <https://github.com/t-mullen/simple-signal>
- socket.io  <https://socket.io/>

## Usage

This is a template using a basic node.js `server.js` file to act as a tracker and coordinate p2p connection between peers. 

Peers rely on `simple-signal` for signalling and establishing connections. 

Data can be sent back and forth using `peer.send(data)` and handled across a full mesh network topology within the browser client.

## Author

mfsoftworks <it@nygmarosebeauty.com>
