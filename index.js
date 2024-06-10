import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import forexRoutes from './src/routes/forex.routes.js';
import { globalErrorHandler } from './src/utils/globalErrorHandler.js';

const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json());

app.get('/', forexRoutes);
app.get('/rates', forexRoutes);
app.get('/convert', forexRoutes);

app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

