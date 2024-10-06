"use client"; // top to the file
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "../app/globals.css";
import "leaflet/dist/leaflet.css";
import Sidebar from "./Sidebar";
import L from "leaflet"; // Import leaflet for custom icon

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const customIcon = L.icon({
  iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-1024.png', // Replace with the path to your custom icon
  iconSize: [38, 38], // Size of the icon
  iconAnchor: [19, 38], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -38] // Point from which the popup should open relative to the iconAnchor
});

const MapComponent = ({ lat, lng }) => {
  const [coordinates, setCoordinates] = useState({ lat, lng });
  const [markerPosition, setMarkerPosition] = useState({ lat, lng });

  useEffect(() => {
    setCoordinates({ lat, lng });
    setMarkerPosition({ lat, lng });
  }, [lat, lng]);

  const updateMap = (lat, lng) => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    console.log(`Updated map to: Latitude: ${parsedLat}, Longitude: ${parsedLng}`);
    setCoordinates({ lat: parsedLat, lng: parsedLng });
    setMarkerPosition({ lat: parsedLat, lng: parsedLng });
  };

  const handleMarkerDragEnd = (event) => {
    const { lat, lng } = event.target.getLatLng();
    console.log(`Marker dragged to: Latitude: ${lat}, Longitude: ${lng}`);
    setMarkerPosition({ lat, lng });
  };

  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    console.log(`Map clicked at: Latitude: ${lat}, Longitude: ${lng}`);
    setMarkerPosition({ lat, lng });
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar updateMap={updateMap} />
      <MapContainer 
        center={[coordinates.lat, coordinates.lng]} 
        zoom={13} 
        style={{ height: "100vh", width: "75%" }}
        onClick={handleMapClick}
        key={`${coordinates.lat}-${coordinates.lng}`} // Force re-render on coordinates change
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={[markerPosition.lat, markerPosition.lng]} 
          draggable={true} 
          eventHandlers={{ dragend: handleMarkerDragEnd }}
          icon={customIcon} // Use the custom icon
        >
          <Popup>
            Your location
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;