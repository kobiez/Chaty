"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controler_1 = __importDefault(require("./controler"));
require("dotenv/config");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.post('/register', controler_1.default.registerLogic);
router.post('/user', controler_1.default.getFacebookDetails);
router.get('/facebook', passport_1.default.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport_1.default.authenticate('facebook', { failureRedirect: `${process.env.FRONTEND_HOST}/register` }), controler_1.default.facebookCallback);
exports.default = router;
