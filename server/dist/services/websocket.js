"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const ws_1 = __importDefault(require("ws"));
const wss = new ws_1.default.Server({ port: process.env.WSS_PORT });
wss.on('connection', function connection(ws) {
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
exports.default = wss;
