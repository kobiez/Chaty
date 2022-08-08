import mongoose from 'mongoose'

const roomsSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
        lowercase: true
    },
    createdAt: {
        type: String,
        required: true
    },
    users: [String],
    messages: [{
        userName: {
            type: String,
            required: true
        },
        sendDate: {
            type: String,
            required: true
        },
        messageBody: {
            type: String,
            required: true
        }
    }]
})

const roomsModel = mongoose.model("chaty-rooms", roomsSchema);

export default roomsModel;