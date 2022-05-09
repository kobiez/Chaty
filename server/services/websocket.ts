import 'dotenv/config';
import WebSocket from 'ws';

const wss: WebSocket.Server = new WebSocket.Server({ port: <number | undefined>process.env.WSS_PORT });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message: string) {
        const bufferToJson = message.toString();
        const jsonToObject = JSON.parse(bufferToJson);
        const messageToSend = jsonToObject.message;

        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(messageToSend)
            };
        });
    });
});

export default wss;