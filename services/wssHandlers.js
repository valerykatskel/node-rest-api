const clients = new Set();

const onCloseHandler = () => console.log('WebSocket disconnected');

const onConnectionHandler = (socket) => {
    console.log(`WebSocket клиент подключился`);
    // Add client to set
    clients.add(socket);

    socket.on('message', (data) => {
        console.log(`Получено сообщение: ${data} from client`);
        // Broadcast message to other clients
        for (const client of clients) {
            if (client !== socket) {
                client.send(`Переслано всем: ${data}`);
            }
        }
    });
    socket.on('close', onCloseHandler);
}

module.exports = { onConnectionHandler };