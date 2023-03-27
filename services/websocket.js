const WebSocket = require('ws');

function createWebSocketServer() {
  // Create a WebSocket server
  const port = process.env.WS_PORT || 8080;
  const wsServer = new WebSocket.Server({ port });
  wsServer.on('listening', () => {
    console.log(`WebSocket server started on http://localhost:${port}`);
  });
  // Keep track of connected clients
  const clients = new Set();

  // Handle WebSocket connections
  wsServer.on('connection', (socket) => {
    console.log(`WebSocket клиент подключился`);

    // Add client to set
    clients.add(socket);

    // Handle WebSocket messages
    socket.on('message', (data) => {
      console.log(`Получено сообщение: ${data} from client`);

      // Broadcast message to other clients
      for (const client of clients) {
        if (client !== socket) {
          client.send(`Переслано всем: ${data}`);
        }
      }
    });

    // Handle WebSocket disconnections
    socket.on('close', () => {
      console.log('WebSocket клиент отключился');

      // Remove client from set
      clients.delete(socket);
    });
  });
}

module.exports = { createWebSocketServer };
