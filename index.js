import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import forexRoutes from './src/routes/forex.routes.js';

const port = process.env.PORT;
const app = express();
dotenv.config();

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

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";

    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

