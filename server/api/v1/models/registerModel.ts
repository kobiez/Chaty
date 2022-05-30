import mongoose, { Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs'

export interface registerTypesDocument {
    name: string,
    email: string,
    password: string
}

export interface registerTypes extends registerTypesDocument {
    someOtherFunc(password: string): void
}

export interface registerTypesModel extends Model<registerTypes> {
    hashingPassword(password: string): Promise<string>
}

const regisetrSchema: mongoose.Schema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        maxlength: 20,
        trim: true
    },
    email: {
        required: true,
        unique: true,
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

regisetrSchema.pre('save', async function (next): Promise<void> {
    const checkEmailexist: any = await registerModel.findOne({ email: this.email });
    if (!checkEmailexist) {
        console.log('Email added successfully: ', this.email);
        next()
    }
    throw new Error('User already exist');
})

regisetrSchema.statics.hashingPassword = async (password: string): Promise<string> => {
    const hashedPasswors: string = await bcrypt.hash(password, 8)
    return hashedPasswors;
}

const registerModel: registerTypesModel = mongoose.model<registerTypes, registerTypesModel>('chaty-register', regisetrSchema);

export default registerModel;