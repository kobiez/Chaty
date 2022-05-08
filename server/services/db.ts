import mongoose from 'mongoose';
import 'dotenv/config';

class MongoService {
    static async connectToDb(uri: string | undefined): Promise<void> {
        try {
            await mongoose.connect(<string>uri);
            console.log('Successfully connected to DB');
        } catch (error) {
            console.error(error);
        }
    }

    static async clearDb(): Promise<void> {
        await mongoose.connection.dropDatabase();
    }

    static async closeDb(): Promise<void> {
        await mongoose.connection.close();
    }
}

export default MongoService;