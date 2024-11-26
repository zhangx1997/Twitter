import React, { useEffect, useState } from 'react';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state

  // Fetch all posts on initial load
  useEffect(() => {
    setLoading(true); // Start loading
    fetch('http://localhost:3000/api/posts')
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        setLoading(false); // Stop loading
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts');
        setLoading(false); // Stop loading
      });
  }, []);

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
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Attach the token for authentication
        },
        body: JSON.stringify({ text: newPost }),  // Ensure it's 'text' not 'content'
      });

      if (response.ok) {
        const createdPost = await response.json();
        setPosts([createdPost.post, ...posts]); // Add the new post at the top
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

  // Handle deleting a post
  const handleDelete = async (postId) => {
    const token = localStorage.getItem('authToken'); // Get token from localStorage
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Attach the token for authentication
        },
      });

      if (response.ok) {
        setPosts(posts.filter(post => post._id !== postId)); // Remove the post from the state
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    }
  };

  return (
    <div>
      <h1>Home Page</h1>

      <div className="create-post">
        <textarea
          placeholder="Write a new post..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button onClick={handlePostSubmit}>Post</button>
      </div>

      {error && <p className="error">{error}</p>}

      <h2>Posts</h2>
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>
              <h3>{post.username}</h3>
              <p>{post.text}</p>
              <p><small>{new Date(post.timestamp).toLocaleString()}</small></p>
              <button onClick={() => handleDelete(post._id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}

export default HomePage;
