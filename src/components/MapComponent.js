"use client"; // top to the file
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "../app/globals.css";
import "leaflet/dist/leaflet.css";
import Sidebar from "./Sidebar";
import L from "leaflet"; // Import leaflet for custom icon
import GeoTIFFLayerComponent from './GeoTIFFLayerComponent'; // Import GeoTIFFLayerComponent

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const customIcon = L.icon({
  iconUrl: 'marker.png', // Replace with the path to your custom icon
  iconSize: [38, 38], // Size of the icon
  iconAnchor: [19, 38], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -38] // Point from which the popup should open relative to the iconAnchor
});

const MapComponent = () => {
  const [coordinates, setCoordinates] = useState({ lat: 51.505, lng: -0.09 }); // Default coordinates
  const [markerPosition, setMarkerPosition] = useState({ lat: 51.505, lng: -0.09 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setMarkerPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

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
    setCoordinates({ lat, lng });
  };

  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    console.log(`Map clicked at: Latitude: ${lat}, Longitude: ${lng}`);
    setMarkerPosition({ lat, lng });
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar updateMap={updateMap} latitude={markerPosition.lat} longitude={markerPosition.lng} />
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
        <GeoTIFFLayerComponent /> {/* Add GeoTIFFLayerComponent here */}
      </MapContainer>
    </div>
  );
};

export default MapComponent;