const clients = new Set();

const onCloseHandler = () => console.log('WebSocket disconnected');

const onConnectionHandler = (socket) => {
    socket.on('message', (data) => {
      // Parse the incoming message
      const { login, machineId, message } = JSON.parse(data);
  
      // Validate the login and machine ID
      if (login !== process.env.ALLOW_LOGIN || machineId !== process.env.ALLOW_MACHINEID) {
        console.log(`Rejected client with invalid credentials: ${socket.remoteAddress}`);
        socket.close();
        return;
      }
  
      console.log(`Accepted client with login=${login} and machineId=${machineId}: ${socket.remoteAddress}`);
  
      // Add client to set
      clients.add(socket);
  
      // Broadcast message to other clients
      for (const client of clients) {
        if (client !== socket) {
          client.send(`Переслано всем: ${message}`);
        }
      }
    });
  
    socket.on('close', onCloseHandler);
  };

module.exports = { onConnectionHandler };