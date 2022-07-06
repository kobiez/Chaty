import { Server, Socket } from "socket.io";
import http from 'http';
import app from '../api/v1/app';
import dayjs from 'dayjs'

const server: http.Server = http.createServer(app);

const io: Server = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket: Socket): void => {
    console.log(`New socket connected: ${socket.id}`)

    socket.on("joinRoom", (room) => {
        socket.join(room)
    })

    socket.on('message', (message) => {
        const now = new Date().getTime()
        const currentTime = dayjs(now).format('DD-MM-YYYY' + '  ' + 'HH:mm:ss')
        io.emit('messageFromServer', message, currentTime)
    })
    
    socket.on("disconnect", (reason) => {
        console.log(`${socket.id} is disconnected because ${reason}`)
    })
})

export default server;