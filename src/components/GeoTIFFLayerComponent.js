import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { fromUrl } from 'geotiff';
import L from 'leaflet';
import proj4 from 'proj4';

const GeoTIFFLayerComponent = () => {
  const map = useMap();

  useEffect(() => {
    const addGeoTIFFLayer = async () => {
      try {
        console.log('Loading GeoTIFF from: Sept.TIF');
        const tiff = await fromUrl('Sept.TIF');
        const image = await tiff.getImage();
        const [xmin, ymin, xmax, ymax] = image.getBoundingBox();

        const metadata = {
          width: image.getWidth(),
          height: image.getHeight(),
          boundingBox: [xmin, ymin, xmax, ymax],
          geoKeys: image.getGeoKeys(),
          samplesPerPixel: image.getSamplesPerPixel(),
          tileWidth: image.getTileWidth(),
          tileHeight: image.getTileHeight(),
          resolution: image.getResolution(),
          origin: image.getOrigin(),
        };
        console.log('GeoTIFF metadata:', metadata);

        const projectionEPSG = metadata.geoKeys.ProjectedCSTypeGeoKey;
        console.log('Projection EPSG:', projectionEPSG);

        // Define the source projection
        const sourceProjStr = `EPSG:${projectionEPSG}`;
        const destProjStr = 'EPSG:4326';
        
        // Add the source projection definition if it's not already known
        if (!proj4.defs(sourceProjStr)) {
          proj4.defs(sourceProjStr, metadata.geoKeys.ProjWKT);
        }

        // Reproject the bounding box
        const llCorner = proj4(sourceProjStr, destProjStr, [xmin, ymin]);
        const urCorner = proj4(sourceProjStr, destProjStr, [xmax, ymax]);
        
        const imageBounds = [llCorner.reverse(), urCorner.reverse()];
        console.log('Reprojected image bounds:', imageBounds);

        const geoTiffLayer = L.GridLayer.extend({
          createTile: function(coords, done) {
            const tile = L.DomUtil.create('canvas', 'leaflet-tile');
            const size = this.getTileSize();
            tile.width = size.x;
            tile.height = size.y;
            const ctx = tile.getContext('2d');

            const tileSize = 256;
            const nwPoint = coords.scaleBy(tileSize);
            const sePoint = nwPoint.add([tileSize, tileSize]);

            const nw = this._map.unproject(nwPoint, coords.z);
            const se = this._map.unproject(sePoint, coords.z);

            const nwUtm = proj4(destProjStr, sourceProjStr, [nw.lng, nw.lat]);
            const seUtm = proj4(destProjStr, sourceProjStr, [se.lng, se.lat]);

            image.readRasters({
              window: [
                Math.floor((nwUtm[0] - xmin) / metadata.resolution[0]),
                Math.floor((ymax - nwUtm[1]) / metadata.resolution[1]),
                Math.ceil((seUtm[0] - xmin) / metadata.resolution[0]),
                Math.ceil((ymax - seUtm[1]) / metadata.resolution[1])
              ],
              width: tileSize,
              height: tileSize
            }).then(rasters => {
              const data = rasters[0];
              const imageData = ctx.createImageData(tileSize, tileSize);
              const min = Math.min(...data);
              const max = Math.max(...data);

              for (let i = 0; i < data.length; i++) {
                const val = Math.floor(((data[i] - min) / (max - min)) * 255);
                const idx = i * 4;
                imageData.data[idx] = val;
                imageData.data[idx + 1] = val;
                imageData.data[idx + 2] = val;
                imageData.data[idx + 3] = 255;
              }

              ctx.putImageData(imageData, 0, 0);
              done(null, tile);
            }).catch(error => {
              console.error('Error reading rasters:', error);
              done(error, tile);
            });

            return tile;
          }
        });

        new geoTiffLayer({ opacity: 0.3 }).addTo(map);

        map.fitBounds(imageBounds);
        console.log('Map bounds after fitBounds:', map.getBounds());
        console.log('GeoTIFF layer added successfully');
      } catch (error) {
        console.error("Error adding GeoTIFF layer:", error);
      }
    };

    addGeoTIFFLayer();
  }, [map]);

  return null;
};

export default GeoTIFFLayerComponent;