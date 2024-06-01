import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import clientRouter from './controllers/clientController';
import jobFormRouter from './controllers/jobFormsController';
import jobRouter from './controllers/jobController';
import employeeRouter from './controllers/employeeController';
import adminRouter from './controllers/adminController';
import salaryUpdatesRouter from './controllers/salaryUpdatesController';
import employeeTrainingRouter from './controllers/employeeTrainingController';
import empRequestRouter from './controllers/employeeRequestController';
import timeSheetController from './controllers/timeSheetEntryController';
import timeSheetTemplateRouter from './controllers/timeSheetTemplateController';
import taskRouter from './controllers/TaskController'
import dashboradRouter from './controllers/dashboardController';
import reportsRouter from './controllers/reportsController';
import revenueRouter from './controllers/revenueController';
import operationalProfitAndLossRouter from './controllers/operationalProfitAndLossController';
import { utils } from './services/utils';
import cors from 'cors';
import morgan from 'morgan';


dotenv.config();

const app: express.Application = express();
const PORT: string = process.env.PORT as string;

app.use(express.json({ limit: '5mb' }));
app.use(
    morgan('combined', {
        skip: (req: Request) => req.method === "OPTIONS",
    })
);
app.use(cors())
app.use(bodyParser.json());
app.use('/client', clientRouter);
app.use(jobRouter);
app.use(jobFormRouter);
app.use(employeeRouter);
app.use(adminRouter);
app.use(empRequestRouter);
app.use(salaryUpdatesRouter);
app.use(employeeTrainingRouter);
app.use(timeSheetController);
app.use(timeSheetTemplateRouter);
app.use(taskRouter);
app.use(dashboradRouter);
app.use(reportsRouter);
app.use(revenueRouter);
app.use(operationalProfitAndLossRouter);

app.get('/', (_req: Request, res: Response): void => {
    res.status(200).json({
        message: 'Server Started!'
    });
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
utils.createAdmin()

app.listen(PORT, (): void => {
    console.log(`Server Running On Port: ${PORT}`);
});