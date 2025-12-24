import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';



import { connectDB } from './config/db.js';
import userRouter from './routes/userRouter.js';
import goalsRouter from './routes/goalsRouter.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Adjust to your frontend URL
    credentials: true // Allow cookies to be sent
}));

// Middleware
app.use(express.json());
app.use(cookieParser()); // Parse cookies for JWT

connectDB();

app.get('/', (req, res) => {
    res.send('Cassandra DB Connection Test');
});

// Routes
app.use('/api/users', userRouter);
app.use('/api/goals', goalsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




