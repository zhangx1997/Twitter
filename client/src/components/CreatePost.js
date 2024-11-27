import React, { useState } from 'react';

const CreatePost = () => {
  const [newPost, setNewPost] = useState('');
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]); // Store posts in the state

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!newPost.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }

    // Send the new post to the backend
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newPost }),  // Ensure it's 'text' not 'content'
      });

      if (response.ok) {
        const createdPost = await response.json();
        setPosts([createdPost.post, ...posts]);  // Add the new post to the state
        setNewPost('');
        setError('');
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post');
    }
  };

  return (
    <div>
      <form onSubmit={handlePostSubmit}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          rows="4"
          maxLength="280"
        ></textarea>
        <button type="submit">Post</button>
      </form>

      {error && <p className="error">{error}</p>}

      {/* Display posts */}
      <div>
        {posts.map((post) => (
          <div key={post._id} className="post">
            <p>{post.text}</p> {/* Display the text content */}
            <p><strong>{post.username}</strong></p>
            <p>{new Date(post.timestamp).toLocaleString()}</p> {/* Display formatted timestamp */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePost;
