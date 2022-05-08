import mongoose from 'mongoose';

interface facebookLoginTypes {
    id: string,
    displayname: string,
    photo: string
}

const facebookLoginSchema: mongoose.Schema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    }
})

const facebookLoginModel: mongoose.Model<facebookLoginTypes> = mongoose.model('FacebookLogin', facebookLoginSchema);

export default facebookLoginModel;