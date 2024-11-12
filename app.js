import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import connection from './db/connection.js';
import users from './routes/user.js';
import tasks from './routes/tasks.js';
import notFoundHandler from './middleware/notFound.js';
import authenticate from './middleware/authMiddleware.js';


dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// get the directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

// bodyparser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setup static folder
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api/v1/users', users);
app.use('/api/v1/tasks', authenticate, tasks);


// not found error handler
app.use(notFoundHandler);

const start = async () => {
    try {
        // connecting to db
        await connection(MONGO_URI);
        // listening to the server
        app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));

    } catch (error) {
        console.log(error);
    }
};


start();