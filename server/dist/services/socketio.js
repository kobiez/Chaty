"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("../api/v1/app"));
const dayjs_1 = __importDefault(require("dayjs"));
const roomsModel_1 = __importDefault(require("../api/v1/models/roomsModel"));
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => {
    console.log(`New socket connected: ${socket.id}`);
    socket.on("joinRoom", (room, userName) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(room);
        const now = new Date().getTime();
        const currentTime = (0, dayjs_1.default)(now).format('DD-MM-YYYY' + '  ' + 'HH:mm:ss');
        const adminHello = {
            user: "Admin",
            message: `${userName} just connected to room "${room}"`
        };
        socket.broadcast.to(room).emit("messageFromServer", adminHello, currentTime);
        // Save room details in data base
        const isRoom = yield roomsModel_1.default.findOne({ roomName: room });
        if (!isRoom) {
            const roomToSave = new roomsModel_1.default({
                roomName: room,
                createdAt: currentTime,
                users: userName
            });
            return yield roomToSave.save();
        }
        //Update room "users" array only if user not already excist
        const isUserInRoom = isRoom.users.find((user) => user === userName);
        if (!isUserInRoom) {
            yield isRoom.updateOne({ users: [...isRoom.users, userName] });
            return yield isRoom.save();
        }
    }));
    socket.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        message = Object.assign(Object.assign({}, message), { socket: socket.id });
        console.log(message);
        const now = new Date().getTime();
        const currentTime = (0, dayjs_1.default)(now).format('DD-MM-YYYY' + '  ' + 'HH:mm:ss');
        io.to(message.room).emit('messageFromServer', message, currentTime);
        const findRoom = yield roomsModel_1.default.findOne({ roomName: message.room });
        yield findRoom.updateOne({
            messages: [...findRoom.messages, {
                    userName: message.user,
                    sendDate: currentTime,
                    messageBody: message.message
                }]
        });
        yield findRoom.save();
    }));
    socket.on("disconnect", (reason) => {
        console.log(`${socket.id} is disconnected because ${reason}`);
    });
});
exports.default = server;
