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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const regisetrSchema = new mongoose_1.default.Schema({
    name: {
        required: true,
        type: String,
        maxlength: 20,
        trim: true
    },
    email: {
        required: true,
        unique: true,
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
regisetrSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const checkEmailexist = yield registerModel.findOne({ email: this.email });
        if (!checkEmailexist) {
            console.log('Email added successfully: ', this.email);
            next();
        }
        throw new Error('User already exist');
    });
});
regisetrSchema.statics.hashingPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPasswors = yield bcryptjs_1.default.hash(password, 8);
    return hashedPasswors;
});
const registerModel = mongoose_1.default.model('chaty-register', regisetrSchema);
exports.default = registerModel;
