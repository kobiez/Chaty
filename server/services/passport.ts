import passport from 'passport';
import * as FbStrategy from 'passport-facebook';
import 'dotenv/config';

const FacebookStarategy: any = FbStrategy.Strategy;

passport.use(new FacebookStarategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'name', 'photos'],
    passReqToCallback: true,
},
    function (req: Request, accessToken: string, refreshToken: string, profile: string, cb: Function): Function {
        return cb(null, profile);
    }));

passport.serializeUser(function (user: Express.User, cb: Function): void {
    cb(null, user);
});

passport.deserializeUser(function (obj: unknown, cb): void {
    cb(null, <false | null | undefined>obj);
});

export default passport;