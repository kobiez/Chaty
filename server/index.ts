import 'dotenv/config';
import MongoService from './services/db';

MongoService.connectToDb(process.env.DB_CONNECTION);

import app from './api/v1/app';

const port: any = process.env.LOCAL_PORT;

app.listen(port, (): void => {
    console.log(`Server is up at port ${port}`);
});