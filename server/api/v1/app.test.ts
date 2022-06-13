import request from "supertest"; 
import httpStatus from 'http-status';
import { MongoMemoryServer } from 'mongodb-memory-server';
import MongoService from '../../services/db';
import app from '../v1/app'

let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await MongoService.connectToDb(uri);
})

afterEach(async () => await MongoService.clearDb());

afterAll(async () => await Promise.all([MongoService.closeDb(), mongod.stop()]))

test('Should return OK status for saving user login data', async () => {
    await request(app)
        .post('/register')
        .send({
            name: 'John Doe',
            email: 'jhon_doe@example.com',
            password: '1234567'
        }).expect(httpStatus.OK);
});