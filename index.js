const socket = io('localhost:8008');
const tracker = new SimpleSignalClient(socket);

// Initiate peer connection
async function connectToPeer(id) {
    // Don't request connection to self
    if (id === socket.id) return;

    // log peer and connect
    console.log('connecting to peer', id);
    const { peer, metadata } = await tracker.connect(id);
    console.log('connected to', id, metadata);
    onPeer(peer);
}

// Handle peer data
function onPeer (peer) {
    // Handle peer connect
    peer.on('connect', () => {
        tracker.peers().forEach((p, i) => {
            // skip self
            if (i != 0) {
                p.send(JSON.stringify({
                    type: 'NEWCONNECT',
                    data: { message: `New connection from peer ${peer._id}` }
                }))
            }
        });
    });
    peer.on('data', (message) => {
        let data = dataToObject(message);
        switch (data.type) {
            case 'NEWCONNECT':
            default:
                console.log('peer', peer._id, '\ndata', data);
        }
    });
    console.log('tracker', tracker);
    console.log('tracker peers', tracker.peers());
}

// Convert Uint8Array buffer to object
function dataToObject (data) {
    return JSON.parse(new TextDecoder('utf-8').decode(data));
}

// On tracker request, accept and handle peer
tracker.on('request', async (request) => {
    const { peer, metadata } = await request.accept();
    console.log('connected to peer', peer, metadata);
    onPeer(peer);
});

// On tracker discovery, connect to peers
tracker.on('discover', (data) => {
    console.log('discovery', data);
    data.peers.forEach(id => connectToPeer(id));
});

// Get initial peers
console.log('requesting peers');
tracker.discover({
    config: {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
        ]
    },
    stream: false,
    trickle: true
});
