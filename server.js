const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
  console.log('WebSocket connected');

  ws.on('message', (data) => {
    console.log(`Received message: ${data}`);

    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`Broadcast: ${data}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('WebSocket disconnected');
  });
});

console.log(`WebSocket server started on port ${PORT}`);
