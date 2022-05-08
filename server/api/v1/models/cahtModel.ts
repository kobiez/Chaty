import mongoose from 'mongoose';
import validator from 'validator';

export interface ChatTypes {
    name: string,
    email: string,
    password: string
}

const chatSchema: mongoose.Schema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        maxlength: 20,
        trim: true
    },
    email: {
        required: true,
        type: String,
        trim: true,
        validate: (value: string): void => {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address!!")
            }
        }
    },
    password: {
        required: true,
        minlength: 6,
        type: String,
        trim: true
    }
})

chatSchema.pre('save', async function (next) {
    const checkEmailexist: any = await chatModel.findOne({ email: this.email });
    if (!checkEmailexist) {
        console.log('Email added successfully: ', this.email);
        next()
    }
    throw new Error('User already exist');
})

const chatModel: mongoose.Model<ChatTypes> = mongoose.model('chaty-login', chatSchema);

export default chatModel;