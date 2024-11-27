const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Load environment variables
dotenv.config();

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

// Set up CORS options for production and development
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:10000', // Default to localhost in development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies to be sent with requests
};

const app = express();

// Middleware
app.use(cors());  // Use dynamic CORS based on the environment
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Serve the React app for the root and any unmatched routes
  app.get('*', (req, res) => {
    console.log('Serving React frontend...');
    res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
  });
}

// Start the Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
