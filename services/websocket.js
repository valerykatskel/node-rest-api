const WebSocket = require('ws');

function createWebSocketServer() {
  // Create a WebSocket server
  const wsServer = new WebSocket.Server({ port: 8080 });

  // Keep track of connected clients
  const clients = new Set();

  // Handle WebSocket connections
  wsServer.on('connection', (socket) => {
    console.log(socket)
    console.log(`WebSocket client connected`);

    // Add client to set
    clients.add(socket);

    // Handle WebSocket messages
    socket.on('message', (data) => {
      console.log(`Received message: ${data} from client ${socket}`);

      // Broadcast message to other clients
      for (const client of clients) {
        if (client !== socket) {
          client.send(`Переслано всем: ${data}`);
        }
      }
    });

    // Handle WebSocket disconnections
    socket.on('close', () => {
      console.log('WebSocket client disconnected');

      // Remove client from set
      clients.delete(socket);
    });
  });
}

module.exports = { createWebSocketServer };
