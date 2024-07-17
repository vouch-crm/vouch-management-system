"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const clientController_1 = __importDefault(require("./controllers/clientController"));
const jobFormsController_1 = __importDefault(require("./controllers/jobFormsController"));
const jobController_1 = __importDefault(require("./controllers/jobController"));
const employeeController_1 = __importDefault(require("./controllers/employeeController"));
const adminController_1 = __importDefault(require("./controllers/adminController"));
const salaryUpdatesController_1 = __importDefault(require("./controllers/salaryUpdatesController"));
const employeeTrainingController_1 = __importDefault(require("./controllers/employeeTrainingController"));
const employeeRequestController_1 = __importDefault(require("./controllers/employeeRequestController"));
const timeSheetEntryController_1 = __importDefault(require("./controllers/timeSheetEntryController"));
const timeSheetTemplateController_1 = __importDefault(require("./controllers/timeSheetTemplateController"));
const TaskController_1 = __importDefault(require("./controllers/TaskController"));
const dashboardController_1 = __importDefault(require("./controllers/dashboardController"));
const reportsController_1 = __importDefault(require("./controllers/reportsController"));
const revenueController_1 = __importDefault(require("./controllers/revenueController"));
const operationalProfitAndLossController_1 = __importDefault(require("./controllers/operationalProfitAndLossController"));
const projectController_1 = __importDefault(require("./controllers/projectController"));
const utils_1 = require("./services/utils");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json({ limit: '5mb' }));
app.use((0, morgan_1.default)('combined', {
    skip: (req) => req.method === "OPTIONS",
}));
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/client', clientController_1.default);
app.use(jobController_1.default);
app.use(jobFormsController_1.default);
app.use(employeeController_1.default);
app.use(adminController_1.default);
app.use(employeeRequestController_1.default);
app.use(salaryUpdatesController_1.default);
app.use(employeeTrainingController_1.default);
app.use(timeSheetEntryController_1.default);
app.use(timeSheetTemplateController_1.default);
app.use(TaskController_1.default);
app.use(dashboardController_1.default);
app.use(reportsController_1.default);
app.use(revenueController_1.default);
app.use(operationalProfitAndLossController_1.default);
app.use(projectController_1.default);
app.get('/', (_req, res) => {
    res.status(200).json({
        message: 'Server Started!'
    });
});
const connectDB = async () => {
    try {
        const connectionString = process.env.DB_CONNECTION_STRING;
        await mongoose_1.default.connect(connectionString);
        console.log('Database connected successfully!');
    }
    catch (error) {
        console.error('Failed to connect to the database', error);
    }
};
connectDB();
utils_1.utils.createAdmin();
app.listen(PORT, () => {
    console.log(`Server Running On Port: ${PORT}`);
});
