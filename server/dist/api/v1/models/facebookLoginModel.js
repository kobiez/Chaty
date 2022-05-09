"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const facebookLoginSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    photo: {
        type: String,
        required: true
    }
});
const facebookLoginModel = mongoose_1.default.model('FacebookLogin', facebookLoginSchema);
exports.default = facebookLoginModel;
