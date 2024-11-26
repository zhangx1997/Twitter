const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

// Create a post (protected route)
router.post('/', authMiddleware, async (req, res) => {
  const { text } = req.body; // Ensure the field is 'text'
  const userId = req.user.id; // Get the user ID from the token

  // Validate text
  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'text is required' });
  }

  try {
    const post = new Post({
      text, // Store the text in the database
      username: req.user.username, // Get the username from the token
      user: userId, // Store the user ID in the post
      timestamp: new Date(),
    });

    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(400).json({ message: 'Error creating post', error: error.message });
  }
});

// Update a post
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'text is required to update post' });
  }

  try {
    const post = await Post.findByIdAndUpdate(id, { text }, { new: true });
    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(400).json({ message: 'Error updating post', error: error.message });
  }
});

// Delete a post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Delete request for post ID:', req.params.id);

    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log('Post not found');
      return res.status(404).json({ message: 'Post not found' });
    }

    console.log('Post found:', post);

    if (post.user.toString() !== req.user._id.toString()) {
      console.log('Unauthorized user:', req.user._id);
      return res.status(403).json({ message: 'Unauthorized' });
    }

    console.log('Authorized user, deleting post');
    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error during delete:', error.message, error.stack);
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});


module.exports = router;
