require('dotenv').config();
const clients = new Set();

const onCloseHandler = (socket, clients) => {
    clients.delete(socket);
    console.log(`WebSocket disconnected. Total: ${clients.size}`);
}

const onConnectionHandler = (socket) => {

    if (!clients.has(socket)) {
        clients.add(socket);
        console.log(`Added a new client. Total: ${clients.size}`);
    }

    socket.on('message', (data) => {
        const mes = data.toString('utf8');

        for (const client of clients) {
            if (client !== socket) {
                client.send(`${mes}`);
            }
        }

        /*if (clients.has(socket)) {
            // Broadcast message to other clients
            for (const client of clients) {
                if (client !== socket) {
                    client.send(`${mes}`);
                }
            }
        } else {
            //try {
                //const { login, machineId, message } = JSON.parse(data);

                // Validate the login and machine ID
                if (machineId !== process.env.ALLOW_MACHINEID) {
                    console.log(`Rejected client with invalid credentials`);
                    socket.close(1007, 'Invalid data');
                    return;
                }
                
                // Add client to set
                
                //clients.add(socket);
                //console.log(`Added a new client. Total: ${clients.size}`);
            } catch (error) {
                console.log(`Rejected client with wrong message format`);
                socket.close(1003, 'Unsupported data');
                return;
            }
        }*/
    });
    socket.on('close', () => onCloseHandler(socket, clients));
}

module.exports = { onConnectionHandler };