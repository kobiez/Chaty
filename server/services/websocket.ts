import 'dotenv/config';
import WebSocket from 'ws';

const wss: WebSocket.Server = new WebSocket.Server({ port: <number | undefined>process.env.WSS_PORT });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message: Buffer) {
        const bufferToJson: Object = message.toString();
        const jsonToObject: any = JSON.parse(<string>bufferToJson);
        const messageToSend: string = jsonToObject.message;

        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(messageToSend)
            };
        });
    });
});

export default wss;