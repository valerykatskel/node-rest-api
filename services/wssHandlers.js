require('dotenv').config();
const clients = new Set();

const onCloseHandler = (data) => console.log(`WebSocket disconnected, code is ${data}`);

const onConnectionHandler = (socket) => {
    socket.on('message', (data) => {
        const mes = data.toString('utf8');
        if (clients.has(socket)) {
            // Broadcast message to other clients
            for (const client of clients) {
                if (client !== socket) {
                    client.send(`${mes}`);
                }
            }
        } else {
            if (mes.indexOf('{') === -1 || mes.indexOf('{') > 0) {
                console.log(`Rejected client with wrong message format`);
                socket.close(1003, 'Unsupported data');
                return;
            }
            try {
                const { login, machineId, message } = JSON.parse(data);
                console.log(login);
                console.log(machineId)
                // Validate the login and machine ID
                if (login !== process.env.ALLOW_LOGIN || machineId !== process.env.ALLOW_MACHINEID) {
                    console.log(`Rejected client with invalid credentials: ${socket.remoteAddress}`);
                    socket.close(1007, 'Invalid data');
                    return;
                }
                
                // Add client to set
                clients.add(socket);
                console.log(`Accepted client with login=${login} and machineId=${machineId}: ${socket.remoteAddress}. Total: ${clients.size}`);
            } catch (error) {
                console.log(`Rejected client with wrong message format`);
                socket.close(1003, 'Unsupported data');
                return;
            }
        }
    });
    socket.on('close', onCloseHandler);
}

module.exports = { onConnectionHandler };