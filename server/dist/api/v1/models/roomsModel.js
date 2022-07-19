"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomsSchema = new mongoose_1.default.Schema({
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
            _id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                required: true
            },
            userName: {
                type: String,
                required: true
            },
            sendDate: {
                type: Date,
                required: true
            },
            messageBody: {
                type: String,
                required: true
            }
        }]
});
const roomsModel = mongoose_1.default.model("chaty-rooms", roomsSchema);
exports.default = roomsModel;
