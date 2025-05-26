// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.message}>The page you're looking for doesn't exist.</p>
      <Link to="/" style={styles.link}>Go back to Home</Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '100px 20px',
  },
  title: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  message: {
    fontSize: '20px',
    marginBottom: '30px',
  },
  link: {
    textDecoration: 'none',
    backgroundColor: '#6366f1',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
};

export default PageNotFound;
