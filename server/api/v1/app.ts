import express, { Express } from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from './router'
import passport from 'passport';
import * as FbStrategy from 'passport-facebook';

const FacebookStarategy: any = FbStrategy.Strategy;
const app: Express = express();

passport.use(new FacebookStarategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'name', 'photos'],
    passReqToCallback: true,
},
    function (req: Request, accessToken: string, refreshToken: string, profile: [], cb: Function): Function {
        return cb(null, profile);
    }));

passport.serializeUser(function (user: Express.User, cb: Function): void {
    cb(null, user);
});

passport.deserializeUser(function (obj: unknown, cb) {
    cb(null, <false | null | undefined>obj);
});

app.use(express.json());
app.use(cors());

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);

export default app;