import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './Routes/user.route.js';
import authRouter from './Routes/auth.route.js';
import listingRouter from './Routes/listing.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './utils/error.js';
import { createUploadsDir } from './utils/fileUtils.js';
import adminRouter from './Routes/admin.route.js';



// Configurations
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();



// Middleware
app.use(cors({
  origin: ['https://darling-macaron-e7cb02.netlify.app/',
    'http://localhost:5173',
  ]
  ,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Backend is live');
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const uploadsDir = createUploadsDir(__dirname, 'uploads'); //Alternate Version

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/admin', adminRouter);

app.use(express.static(path.join(__dirname, '/src/dist')));

app.get('*',(req, res)=>{
  res.sendFile(path.join(__dirname, 'src', 'dist', 'index.html'));
})

// Error Handling
app.use(errorHandler);

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});