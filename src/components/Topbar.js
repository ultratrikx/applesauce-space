"use client";
import React from 'react';

const Topbar = () => {
  return (
    <div style={styles.topbar}>
      <p style={styles.placeholderText}>Map Data: Placeholder for relevant map data fetched from APIs</p>
    </div>
  );
};

const styles = {
  topbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '75%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  placeholderText: {
    margin: 0,
    fontSize: '16px',
    color: '#333',
  },
};

export default Topbar;