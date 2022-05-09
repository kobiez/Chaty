"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const db_1 = __importDefault(require("./services/db"));
db_1.default.connectToDb(process.env.DB_CONNECTION);
const app_1 = __importDefault(require("./api/v1/app"));
const port = process.env.LOCAL_PORT;
app_1.default.listen(port, () => {
    console.log(`Server is up at port ${port}`);
});
