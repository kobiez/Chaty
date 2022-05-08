"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const db_1 = __importDefault(require("./services/db"));
const ws_1 = __importDefault(require("ws"));
db_1.default.connectToDb(process.env.DB_CONNECTION);
const app_1 = __importDefault(require("./api/v1/app"));
const port = process.env.LOCAL_PORT;
const wss = new ws_1.default.Server({ port: process.env.WSS_PORT });
wss.on('connection', function connection(ws) {
    console.log('client connected');
    ws.on('message', function incoming(message) {
        const bufferToJson = message.toString();
        const jsonToObject = JSON.parse(bufferToJson);
        const messageToSend = jsonToObject.message;
        wss.clients.forEach(function each(client) {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(messageToSend);
            }
            ;
        });
    });
});
app_1.default.listen(port, () => {
    console.log(`Server is up at port ${port}`);
});
