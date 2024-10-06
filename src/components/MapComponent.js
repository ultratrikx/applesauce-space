"use client"; // top to the file
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "../app/globals.css";
import "leaflet/dist/leaflet.css";
import Sidebar from "./Sidebar";

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });

const MapComponent = () => {
  const [coordinates, setCoordinates] = useState({ lat: 51.505, lng: -0.09 });

  const updateMap = (lat, lng) => {
    setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar updateMap={updateMap} />
      <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={13} style={{ height: "100vh", width: "75%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;