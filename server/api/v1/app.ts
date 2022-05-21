import express, { Express } from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from './router'
import passport from '../../services/passport';
import '../../services/socketio'

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);

export default app;