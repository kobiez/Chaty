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
const cahtModel_1 = __importDefault(require("./models/cahtModel"));
const facebookLoginModel_1 = __importDefault(require("./models/facebookLoginModel"));
class MyProjectControler {
    static loginLogic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginDetails = new cahtModel_1.default({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                yield loginDetails.save();
                res.status(201).send(loginDetails);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    static facebookCallback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.query;
            try {
                if (code) {
                    const facebookLoginDetails = new facebookLoginModel_1.default({
                        _id: req.user.id,
                        displayName: req.user.displayName,
                        photo: req.user.photos[0].value
                    });
                    yield facebookLoginDetails.save();
                    res.redirect(`http://localhost:3000/ChatArea/:${code}?userid=${req.user.id}`);
                }
            }
            catch (error) {
                res.redirect(`http://localhost:3000/login`);
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
                res.send('User not found');
            }
        });
    }
}
exports.default = MyProjectControler;
