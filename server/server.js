import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';


import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
// Database se connect karein
connectDB();

// Express app initialize karein
const app = express();

// Middlewares ka istemal
app.use(cors()); // CORS errors se bachne ke liye
app.use(express.json()); // JSON data ko samajhne ke liye

// Ek simple sa test route
app.get('/', (req, res) => {
  res.send('API is running successfully...');
});

// Port define karein
const PORT = process.env.PORT || 5000;

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/homepage', homeRoutes);



// Server ko sunein (start karein)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});