import React, { useState } from 'react';
import { MapContainer, TileLayer, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom WMS TileLayer component
const WMSTileLayer = ({ url, layers, styles, format, transparent, version, attribution, params }) => {
  const map = useMap();
  
  React.useEffect(() => {
    const wmsLayer = L.tileLayer.wms(url, {
      layers: layers,
      styles: styles,
      format: format,
      transparent: transparent,
      version: version,
      attribution: attribution,
      ...params
    });
    
    wmsLayer.addTo(map);
    
    return () => {
      map.removeLayer(wmsLayer);
    };
  }, [map, url, layers, styles, format, transparent, version, attribution, params]);

  return null;
};

const LandsatFalseColourMap  = () => {
  const [center] = useState([81.5, 28.8]); // Center on the area of interest
  const [zoom] = useState(8);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="Landsat 8-9 Natural Color">
            <WMSTileLayer
              url="https://landsatlook.usgs.gov/arcgis/services/LandsatLook/ImageServer/WMSServer"
              layers="0"
              styles=""
              format="image/png"
              transparent={true}
              version="1.3.0"
              attribution='&copy; <a href="https://www.usgs.gov/">U.S. Geological Survey</a>'
              params={{
                time: '2023-01-01/2024-12-31',
                BANDS: '4,3,2'
              }}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Landsat 8-9 False Color">
            <WMSTileLayer
              url="https://landsatlook.usgs.gov/arcgis/services/LandsatLook/ImageServer/WMSServer"
              layers="0"
              styles=""
              format="image/png"
              transparent={true}
              version="1.3.0"
              attribution='&copy; <a href="https://www.usgs.gov/">U.S. Geological Survey</a>'
              params={{
                time: '2023-01-01/2024-12-31',
                BANDS: '5,4,3'
              }}
            />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default LandsatFalseColourMap;