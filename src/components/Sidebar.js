"use client"
import React, { useState } from 'react';

const Sidebar = ({ updateMap }) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMap(latitude, longitude);
  };

  return (
    <div className="sidebar">
      <h2>Set Coordinates</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Latitude:</label>
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </div>
        <div>
          <label>Longitude:</label>
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>
        <button type="submit">Update Map</button>
      </form>
    </div>
  );
};

export default Sidebar;