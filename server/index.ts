import 'dotenv/config';
import MongoService from './services/db';
import WebSocket, { Server } from 'ws';

MongoService.connectToDb(process.env.DB_CONNECTION);

import app from './api/v1/app';

const port: any = process.env.LOCAL_PORT;
const wss: WebSocket.Server = new WebSocket.Server({ port: <number | undefined>process.env.WSS_PORT });

wss.on('connection', function connection(ws) {
    console.log('client connected');
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

app.listen(port, (): void => {
    console.log(`Server is up at port ${port}`);
})