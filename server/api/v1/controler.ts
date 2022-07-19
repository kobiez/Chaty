import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import registerModel from './models/registerModel';
import facebookLoginModel from './models/facebookLoginModel';

class MyProjectControler {

    static async registerLogic(req: Request, res: Response, next: NextFunction) {
        try {
            const hashedPasswors: string = await registerModel.hashingPassword(req.body.password);

            const registerDetails: mongoose.Document = new registerModel({
                name: req.body.name,
                email: req.body.email,
                password: hashedPasswors
            })

            await registerDetails.save();

            res.send(registerDetails);
            
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'User already exsit' })
        }
    }

    static async facebookCallback(req: any, res: Response, next: NextFunction) {
        const { code }: any = req.query;

        try {
            if (code) {
                const checkDuplicateId: any = await facebookLoginModel.find({ _id: req.user.id });

                if (!checkDuplicateId[0]) {
                    const facebookLoginDetails: any = new facebookLoginModel({
                        _id: req.user.id,
                        displayName: req.user.displayName,
                        email: req.user.emails[0].value,
                        photo: req.user.photos[0].value
                    })
                    await facebookLoginDetails.save();
                }

                if (checkDuplicateId[0].photo !== req.user.photos[0].value) {
                    await facebookLoginModel.updateOne({ _id: req.user.id }, { photo: req.user.photos[0].value })
                }

                res.redirect(`http://localhost:3000/ChatArea/:${code}?userid=${req.user.id}`)
            }
        } catch (error) {
            res.redirect(`http://localhost:3000`)
            console.error(error)
        };
    };

    static async getFacebookDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const userDetails = await facebookLoginModel.findOne({ _id: req.body.userid })
            res.send(JSON.stringify(userDetails))
        } catch (error) {
            console.error(error)
            res.send('User not found');
        }
    }
}

export default MyProjectControler;