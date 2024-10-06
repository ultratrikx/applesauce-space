import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { fromUrl } from 'geotiff';
import L from 'leaflet';

const CustomGeoTIFFLayerComponent = () => {
  const map = useMap();
  const canvasRef = useRef(null);

  useEffect(() => {
    const addGeoTIFFLayer = async () => {
      try {
        const tiff = await fromUrl('PlanetDEM_1s_SanFrancisco.tif');
        const image = await tiff.getImage();
        const rasters = await image.readRasters();
        const data = rasters[0];  // Assuming single-band data

        const width = image.getWidth();
        const height = image.getHeight();
        const [xmin, ymin, xmax, ymax] = image.getBoundingBox();

        // Create an off-screen canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Create an ImageData object
        const imageData = ctx.createImageData(width, height);

        // Fill the ImageData
        for (let i = 0; i < data.length; i++) {
          const val = data[i];
          const idx = i * 4;
          imageData.data[idx] = val;
          imageData.data[idx + 1] = val;
          imageData.data[idx + 2] = val;
          imageData.data[idx + 3] = 255;  // Alpha channel
        }

        // Put the ImageData on the canvas
        ctx.putImageData(imageData, 0, 0);

        // Create an ImageOverlay with the canvas
        const imageBounds = [[ymin, xmin], [ymax, xmax]];
        const imageOverlay = L.imageOverlay(canvas.toDataURL(), imageBounds, { opacity: 0.3 }).addTo(map);

        // Fit the map to the image bounds
        map.fitBounds(imageBounds);

        console.log('GeoTIFF layer added successfully');
      } catch (error) {
        console.error("Error adding GeoTIFF layer:", error);
      }
    };

    addGeoTIFFLayer();
  }, [map]);

  return null;
};

export default CustomGeoTIFFLayerComponent;