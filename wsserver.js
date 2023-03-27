const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;
const { onConnectionHandler } = require('./services/wssHandlers');

const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', onConnectionHandler);

console.log(`WebSocket server started on port ${PORT}`);
