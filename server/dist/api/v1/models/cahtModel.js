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
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const chatSchema = new mongoose_1.default.Schema({
    name: {
        required: true,
        type: String,
        maxlength: 20,
        trim: true
    },
    email: {
        required: true,
        type: String,
        trim: true,
        validate: (value) => {
            if (!validator_1.default.isEmail(value)) {
                throw new Error("Invalid email address!!");
            }
        }
    },
    password: {
        required: true,
        minlength: 6,
        type: String,
        trim: true
    }
});
chatSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const checkEmailexist = yield chatModel.findOne({ email: this.email });
        if (!checkEmailexist) {
            console.log('Email added successfully: ', this.email);
            next();
        }
        throw new Error('User already exist');
    });
});
const chatModel = mongoose_1.default.model('chaty-login', chatSchema);
exports.default = chatModel;
