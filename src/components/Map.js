import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';

const Map = ({ lat, lng, boundingBox, selectedTiff }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }
  }, [lat, lng]);

  useEffect(() => {
    const loadGeoTIFF = async () => {
      if (selectedTiff && boundingBox) {
        try {
          const response = await fetch(selectedTiff);
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const georaster = await parseGeoraster(arrayBuffer);

          if (layerRef.current) {
            mapInstanceRef.current.removeLayer(layerRef.current);
          } 

          const offset = 0.4; // Define the offset value to move the layer downwards


          layerRef.current = new GeoRasterLayer({
            georaster: georaster,
            opacity: 0.7,
            resolution: 256,
            // bounds: adjustedBounds

          });

          layerRef.current.addTo(mapInstanceRef.current);

          const bounds = L.latLngBounds(
            [boundingBox.ymin, boundingBox.xmin],
            [boundingBox.ymax, boundingBox.xmax]
          );
          mapInstanceRef.current.fitBounds(bounds);
        } catch (error) {
          console.error('Error loading GeoTIFF:', error);
        }
      }
    };

    loadGeoTIFF();
  }, [selectedTiff, boundingBox]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default Map;