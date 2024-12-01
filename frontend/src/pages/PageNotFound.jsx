import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>404</h1>
      <h2 style={styles.subHeader}>Page Not Found</h2>
      <p style={styles.paragraph}>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" style={styles.homeLink}>Go to Home</Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    color: '#343a40',
  },
  header: {
    fontSize: '6rem',
    margin: 0,
  },
  subHeader: {
    fontSize: '2rem',
    margin: '0.5rem 0',
  },
  paragraph: {
    fontSize: '1.2rem',
    margin: '1rem 0',
  },
  homeLink: {
    display: 'inline-block',
    marginTop: '1.5rem',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '0.25rem',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease',
  },
};

export default PageNotFound;