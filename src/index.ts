import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import clientRouter from './controllers/clientController';
import jobFormRouter from './controllers/jobFormsController';

dotenv.config();

const app: express.Application = express();
const PORT: string = process.env.PORT as string;

app.use(bodyParser.json());
app.use('/client', clientRouter);
app.use(jobFormRouter);

app.get('/', (_req: Request, res: Response): void => {
    res.send('Server Started!');
});

const connectDB = async (): Promise<void> => {
    try {
        const connectionString: string = process.env.DB_CONNECTION_STRING as string;
        await mongoose.connect(connectionString);
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Failed to connect to the database', error);
    }
}

connectDB();

app.listen(PORT, (): void => {
    console.log(`Server Running On Port: ${PORT}`);
});