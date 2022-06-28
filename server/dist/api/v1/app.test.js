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
const supertest_1 = __importDefault(require("supertest"));
const http_status_1 = __importDefault(require("http-status"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const db_1 = __importDefault(require("../../services/db"));
const socketio_1 = __importDefault(require("../../services/socketio"));
require("dotenv/config");
let mongod;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongod.getUri();
    yield db_1.default.connectToDb(uri);
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () { return yield db_1.default.clearDb(); }));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () { return yield Promise.all([db_1.default.closeDb(), mongod.stop()]); }));
test('Should return OK status for saving user login data', () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(socketio_1.default)
        .post('/register')
        .send({
        name: 'John Doe',
        email: 'jhon_doe@example.com',
        password: '1234567'
    }).expect(http_status_1.default.OK);
}));
