import express, { Router } from 'express';
import MyProjectControler from './controler';
import 'dotenv/config';
import passport from 'passport';

const router: Router = express.Router();

router.post('/login', MyProjectControler.loginLogic);
router.post('/user', MyProjectControler.getFacebookDetails);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${process.env.FRONTEND_HOST}/login` }), MyProjectControler.facebookCallback);

export default router;