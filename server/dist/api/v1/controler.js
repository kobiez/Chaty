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
const registerModel_1 = __importDefault(require("./models/registerModel"));
const facebookLoginModel_1 = __importDefault(require("./models/facebookLoginModel"));
class MyProjectControler {
    static registerLogic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPasswors = yield registerModel_1.default.hashingPassword(req.body.password);
                const registerDetails = new registerModel_1.default({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPasswors
                });
                yield registerDetails.save();
                res.send(registerDetails);
            }
            catch (error) {
                console.error(error);
                res.status(500).send({ error: 'User already exsit' });
            }
        });
    }
    static facebookCallback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.query;
            try {
                if (code) {
                    const checkDuplicateId = yield facebookLoginModel_1.default.find({ _id: req.user.id });
                    if (!checkDuplicateId[0]) {
                        const facebookLoginDetails = new facebookLoginModel_1.default({
                            _id: req.user.id,
                            displayName: req.user.displayName,
                            email: req.user.emails[0].value,
                            photo: req.user.photos[0].value
                        });
                        yield facebookLoginDetails.save();
                    }
                    if (checkDuplicateId[0].photo !== req.user.photos[0].value) {
                        yield facebookLoginModel_1.default.updateOne({ _id: req.user.id }, { photo: req.user.photos[0].value });
                    }
                    res.redirect(`http://localhost:3000/ChatArea/:${code}?userid=${req.user.id}`);
                }
            }
            catch (error) {
                res.redirect(`http://localhost:3000`);
                console.error(error);
            }
            ;
        });
    }
    ;
    static getFacebookDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetails = yield facebookLoginModel_1.default.findOne({ _id: req.body.userid });
                res.send(JSON.stringify(userDetails));
            }
            catch (error) {
                console.error(error);
                res.send('User not found');
            }
        });
    }
}
exports.default = MyProjectControler;
