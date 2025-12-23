import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRouter.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Cassandra DB Connection Test');
});


app.use('/api/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




