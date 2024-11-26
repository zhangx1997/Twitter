import React, { useEffect, useState } from 'react';

const UserPage = ({ match }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`/api/users/${match.params.username}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setPosts(data.posts);
      })
      .catch((error) => console.error('Error fetching user:', error));
  }, [match.params.username]);

  return (
    <div className="user-page">
      {user && (
        <>
          <h1>{user.username}</h1>
          <p>Joined: {new Date(user.timestamp).toLocaleString()}</p>
          <div className="posts">
            {posts.map((post) => (
              <div key={post._id} className="post">
                <p>{post.text}</p>
                <p>{new Date(post.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserPage;
