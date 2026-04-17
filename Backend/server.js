import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';

import userRouter from './routes/userRoute.js';
import incomeRouter from './routes/incomeRoute.js';
import expenseRouter from './routes/expenseRoute.js';
import dashboardRouter from './routes/dashboardRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;


// ➤ CORS CONFIG (IMPORTANT FIX)
app.use(cors({
  origin: "https://expense-tracker-1-xb4m.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


// ➤ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ➤ DB Connection
connectDB();


// ➤ Routes
app.use('/api/user', userRouter);
app.use('/api/income', incomeRouter);
app.use('/api/expense', expenseRouter);
app.use('/api/dashboard', dashboardRouter);


// ➤ Test API
app.get('/', (req, res) => {
  res.send('API Working 🚀');
});


// ➤ Server Start
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});