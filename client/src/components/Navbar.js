import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [username, setUsername] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigate = useNavigate(); // React Router's hook to navigate programmatically

  // Check if there's an auth token in localStorage and fetch the user data
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      fetch('http://localhost:3000/api/users/current', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        setUsername(data.username); // Set the username if token is valid
      })
      .catch(err => console.error('Error fetching user data:', err));
    }
  }, []);

  // Handle login logic
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // On successful login, store the token in localStorage
        localStorage.setItem('authToken', data.token);
        setUsername(username); // Update the username state
        navigate('/'); // Redirect to home page after login
      } else {
        console.log(data.message); // Display error message if any
      }
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear the auth token from localStorage
      localStorage.removeItem('authToken');
      setUsername(''); // Reset the username state to hide user-related info
      navigate('/login'); // Redirect to the login page
  
      // Notify the server about the logout (optional)
      const response = await fetch('http://localhost:3000/api/users/logout', {
        method: 'GET',
      });
  
      if (!response.ok) {
        console.log('Server-side logout failed, but user is logged out locally.');
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };
  

  // Handle login form submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    handleLogin(loginUsername, loginPassword); // Call handleLogin with form data
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Twitter Clone
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          {username ? (
            <>
              <span className="navbar-username">Hello, {username}</span>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <form onSubmit={handleLoginSubmit}>
                <input
                  type="text"
                  placeholder="Username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button type="submit">Login</button>
              </form>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
