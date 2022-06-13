import 'dotenv/config';
import MongoService from './services/db';

MongoService.connectToDb(process.env.DB_CONNECTION);

import server from './services/socketio';

const port: any = process.env.PORT || process.env.LOCAL_PORT;

server.listen(port, (): void => {
    console.log(`Server is up at port ${port}`);
});