// userRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Register user route
router.post('/register', registerUser);

// Login user route
router.post('/login', loginUser); // Call the loginUser function from the controller

// Logout route
router.get('/logout', (req, res) => {
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
