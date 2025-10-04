const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./dbconnect/dbConnect');

const app = express();

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// --- Import Routes ---
const authRoutes = require('./Routes/AuthRoutes');
const bookRoutes = require('./Routes/Book');
const reviewRoutes = require('./Routes/Review');

// --- Use Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Book Review API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('MongoDB Connected Successfully');
});