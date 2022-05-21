import { Server, Socket } from "socket.io";
import http from 'http';
import app from '../api/v1/app';

const server: http.Server = http.createServer(app);

const io: Server = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket: Socket) => {
    console.log('New socket just connected!!')

    socket.on('message', (message) => {
        io.emit('messageFromServer', message.message)
    })
})

export default server;