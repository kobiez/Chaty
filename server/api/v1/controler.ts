import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import chatModel from './models/cahtModel';
import facebookLoginModel from './models/facebookLoginModel';

class MyProjectControler {

    static async loginLogic(req: Request, res: Response, next: NextFunction) {
        try {
            const loginDetails: mongoose.Document = new chatModel({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            await loginDetails.save();
            res.status(201).send(loginDetails);

        } catch (error) {
            console.error(error);
        }
    }

    static async facebookCallback(req: any, res: Response, next: NextFunction) {
        const { code }: any = req.query;

        try {
            if (code) {
                const facebookLoginDetails: any = new facebookLoginModel({
                    _id: req.user.id,
                    displayName: req.user.displayName,
                    photo: req.user.photos[0].value
                })
                await facebookLoginDetails.save();
                res.redirect(`http://localhost:3000/ChatArea/:${code}?userid=${req.user.id}`)
            }
        } catch (error) {
            res.redirect(`http://localhost:3000/login`)
            console.error(error)
        };
    };

    static async getFacebookDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const userDetails = await facebookLoginModel.findOne({ _id: req.body.userid })
            res.send(JSON.stringify(userDetails))
        } catch (error) {
            res.send('User not found');
        }
    }
}

export default MyProjectControler;