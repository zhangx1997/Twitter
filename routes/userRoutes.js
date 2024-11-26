const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register user route
router.post('/register', registerUser);

// Login user route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    // Send the token in the response
    return res.status(200).json({
      message: 'Logged in successfully',
      token, // Include the token in the response
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Logout route
router.get('/logout', (req, res) => {
  // Just send a success response; no token handling needed as we're using localStorage
  return res.status(200).json({ message: 'Logged out successfully' });
});

// Get current user (protected route)
router.get('/current', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ username: user.username });
  } catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
});

module.exports = router;
