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
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/client', clientController_1.default);
app.use(jobController_1.default);
app.use(jobFormsController_1.default);
app.get('/', (_req, res) => {
    res.send('Server Started!');
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
app.listen(PORT, () => {
    console.log(`Server Running On Port: ${PORT}`);
});
