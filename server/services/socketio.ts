import { Server, Socket } from "socket.io";
import http from 'http';
import app from '../api/v1/app';
import dayjs from 'dayjs'
import roomsModel from '../api/v1/models/roomsModel'

const server: http.Server = http.createServer(app);

const io: Server = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket: Socket): void => {
    console.log(`New socket connected: ${socket.id}`)

    socket.on("joinRoom", async (room, userName) => {
        socket.join(room)

        const now: number = new Date().getTime()
        const currentTime: string = dayjs(now).format('DD-MM-YYYY' + '  ' + 'HH:mm:ss')

        const adminHello = {
            user: "Admin",
            message: `${userName} just connected to room "${room}"`
        }

        socket.broadcast.to(room).emit("messageFromServer", adminHello, currentTime)

        // Save room details in data base
        const isRoom = await roomsModel.findOne({ roomName: room });

        if (!isRoom) {
            const roomToSave = new roomsModel({
                roomName: room,
                createdAt: currentTime,
                users: userName
            })
            return await roomToSave.save();
        }

        //Update room "users" array only if user not already excist
        const isUserInRoom: undefined | string = isRoom.users.find((user: string) => user === userName)

        if (!isUserInRoom) {
            await isRoom.updateOne({ users: [...isRoom.users, userName]});

            return await isRoom.save();
        }
    })

    socket.on('message', (message) => {
        message = { ...message, socket: socket.id }

        const now = new Date().getTime()
        const currentTime = dayjs(now).format('DD-MM-YYYY' + '  ' + 'HH:mm:ss')

        io.to(message.room).emit('messageFromServer', message, currentTime)
    })

    socket.on("disconnect", (reason) => {
        console.log(`${socket.id} is disconnected because ${reason}`)
    })
})

export default server;