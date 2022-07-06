"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("../api/v1/app"));
const dayjs_1 = __importDefault(require("dayjs"));
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => {
    console.log(`New socket connected: ${socket.id}`);
    socket.on("joinRoom", (room) => {
        socket.join(room);
    });
    socket.on('message', (message) => {
        const now = new Date().getTime();
        const currentTime = (0, dayjs_1.default)(now).format('DD-MM-YYYY' + '  ' + 'HH:mm:ss');
        io.emit('messageFromServer', message, currentTime);
    });
    socket.on("disconnect", (reason) => {
        console.log(`${socket.id} is disconnected because ${reason}`);
    });
});
exports.default = server;
