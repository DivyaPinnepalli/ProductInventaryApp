import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import productRoutes from './routes/products.route.js'
import authRouter from './routes/auth.js'

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://pinnepallidivya:eA3PkKkfzDd5vz9R@products.mtzboiw.mongodb.net/?retryWrites=true&w=majority&appName=products',)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/auth',authRouter);
app.use('/api/products', productRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));