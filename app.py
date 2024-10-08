import os
import tarfile
import datetime
import json
import rasterio
from rasterio import plot
from matplotlib import pyplot as plt
import numpy as np
from landsatxplore.api import API
from landsatxplore.earthexplorer import EarthExplorer
from flask import Flask, request, jsonify
from PIL import Image  # Add this import for image conversion

app = Flask(__name__)

# Create the output directory
output_dir = './outputs'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# EarthExplorer credentials (replace with your credentials)
username = "ArjunGupta"
password = 'GJ86*gJKdv&i"LM'

# Initialize the API and EarthExplorer instances
api = API(username, password)
ee = EarthExplorer(username, password)

# Function to search, download, and extract the GeoTIFF files
def download_recent_geotiff(lat, lon, start_date, end_date, max_cloud_cover, download_dir):
    try:
        # Search for Landsat scenes
        scenes = api.search(
            dataset='landsat_ot_c2_l2',  # Landsat 8 Collection 2 Level-2 Surface Reflectance dataset
            latitude=lat,
            longitude=lon,
            start_date=start_date,
            end_date=end_date,
            max_cloud_cover=max_cloud_cover,
            max_results=2  # Get the most recent two scenes
        )

        if not scenes or len(scenes) < 2:
            print("Not enough scenes found for the specified location and dates.")
            return None

        # Get the second most recent scene
        scene = scenes[1]
        scene_id = scene['landsat_product_id']
        print(f"Downloading scene {scene_id}...")

        # Download the scene (includes image and metadata files)
        ee.download(scene_id, output_dir=download_dir)

        # Extract files from the downloaded TAR file
        tar_filename = os.path.join(download_dir, f"{scene_id}.tar")
        if os.path.exists(tar_filename):
            with tarfile.open(tar_filename) as tar:
                tar.extractall(download_dir)
            os.remove(tar_filename)
            print(f"Downloaded and extracted scene {scene_id}")
            return scene_id
        else:
            print(f"TAR file {tar_filename} does not exist.")
            return None

    finally:
        # Logout from API and EarthExplorer
        api.logout()
        ee.logout()

# Function to read MTL metadata and extract bounding box coordinates
def get_bounding_box(scene_id, download_dir):
    mtl_file_path = os.path.join(download_dir, f'{scene_id}_MTL.json')

    with open(mtl_file_path) as mtl_file:
        mtl_data = json.load(mtl_file)

    # Access the LANDSAT_METADATA_FILE and then PROJECTION_ATTRIBUTES
    landsat_metadata = mtl_data.get('LANDSAT_METADATA_FILE', {})
    projection_attributes = landsat_metadata.get('PROJECTION_ATTRIBUTES', {})

    # Check if the required keys exist in the PROJECTION_ATTRIBUTES
    required_keys = [
        'CORNER_UL_LAT_PRODUCT', 'CORNER_UL_LON_PRODUCT',
        'CORNER_UR_LAT_PRODUCT', 'CORNER_UR_LON_PRODUCT',
        'CORNER_LL_LAT_PRODUCT', 'CORNER_LL_LON_PRODUCT',
        'CORNER_LR_LAT_PRODUCT', 'CORNER_LR_LON_PRODUCT'
    ]

    for key in required_keys:
        if key not in projection_attributes:
            raise KeyError(f"Key '{key}' not found in the PROJECTION_ATTRIBUTES.")

    # Extract corner coordinates from PROJECTION_ATTRIBUTES
    ul_lat = float(projection_attributes['CORNER_UL_LAT_PRODUCT'])
    ul_lon = float(projection_attributes['CORNER_UL_LON_PRODUCT'])
    ur_lat = float(projection_attributes['CORNER_UR_LAT_PRODUCT'])
    ur_lon = float(projection_attributes['CORNER_UR_LON_PRODUCT'])
    ll_lat = float(projection_attributes['CORNER_LL_LAT_PRODUCT'])
    ll_lon = float(projection_attributes['CORNER_LL_LON_PRODUCT'])
    lr_lat = float(projection_attributes['CORNER_LR_LAT_PRODUCT'])
    lr_lon = float(projection_attributes['CORNER_LR_LON_PRODUCT'])

    # Calculate bounding box coordinates
    xmin = min(ul_lon, ur_lon, ll_lon, lr_lon)
    ymin = min(ul_lat, ll_lat, ur_lat, lr_lat)
    xmax = max(ul_lon, ur_lon, ll_lon, lr_lon)
    ymax = max(ul_lat, ll_lat, ur_lat, lr_lat)

    return xmin, ymin, xmax, ymax

# Image processing function to generate the outputs
def process_geotiff_images(scene_id, download_dir, output_dir):
    # Paths for the bands based on the scene ID
    red_band = rasterio.open(os.path.join(download_dir, f'{scene_id}_B4.TIF'))  # Red
    green_band = rasterio.open(os.path.join(download_dir, f'{scene_id}_B3.TIF'))  # Green
    nir_band = rasterio.open(os.path.join(download_dir, f'{scene_id}_B5.TIF'))  # NIR

    # Read each band
    red_band_data = red_band.read(1)
    green_band_data = green_band.read(1)
    nir_band_data = nir_band.read(1)

    # Normalize the band values for display (0-255)
    def normalize(array):
        array_min, array_max = array.min(), array.max()
        return ((array - array_min) / (array_max - array_min) * 255).astype(np.uint8)

    red_band_norm = normalize(red_band_data)
    green_band_norm = normalize(green_band_data)
    nir_band_norm = normalize(nir_band_data)

    # Create false color composite
    false_color_composite = np.dstack((nir_band_norm, red_band_norm, green_band_norm))

    # Save false color image as GeoTIFF
    false_color_path = os.path.join(output_dir, 'false_color_image.tif')
    with rasterio.open(false_color_path, 'w', driver='Gtiff',
                      width=red_band.width, height=red_band.height,
                      count=3, dtype='uint8',
                      crs=red_band.crs, transform=red_band.transform) as dst:
        dst.write(nir_band_data, 1)
        dst.write(red_band_data, 2)
        dst.write(green_band_data, 3)

    # Convert the false color TIFF to PNG
    false_color_image = Image.open(false_color_path)
    false_color_png_path = os.path.join(output_dir, 'false_color_image.png')
    false_color_image.save(false_color_png_path)

    # NDVI calculation
    red_band_float = red_band_data.astype('f4')
    nir_band_float = nir_band_data.astype('f4')
    ndvi = (nir_band_float - red_band_float) / (nir_band_float + red_band_float)
    ndvi = np.nan_to_num(ndvi, nan=-1)

    # Save NDVI as GeoTIFF
    ndvi_path = os.path.join(output_dir, 'ndvi_image.tif')
    with rasterio.open(ndvi_path, 'w', driver='Gtiff',
                      width=red_band.width, height=red_band.height,
                      count=1, dtype='float32',
                      crs=red_band.crs, transform=red_band.transform) as dst:
        dst.write(ndvi, 1)

    # Convert NDVI TIFF to PNG
    ndvi_image = Image.open(ndvi_path)
    ndvi_png_path = os.path.join(output_dir, 'ndvi_image.png')
    ndvi_image.save(ndvi_png_path)

    # Plot and save PNGs for each graph individually
    plt.figure(figsize=(12, 12))

    # Plot False Color Composite and save it as a PNG
    plt.imshow(false_color_composite)
    plt.title('False Color Composite')
    plt.axis('off')
    plt.savefig(false_color_png_path)  # already saved PNG here
    plt.close()

    # Plot NDVI and save it as a PNG
    plt.imshow(ndvi, cmap='viridis')
    plt.colorbar(label="NDVI")
    plt.title('NDVI (Normalized Difference Vegetation Index)')
    plt.axis('off')
    ndvi_png = os.path.join(output_dir, 'ndvi_image.png')  # PNG path
    plt.savefig(ndvi_png)
    plt.close()

    # Plot NIR Band and save it as a PNG
    plt.imshow(nir_band_norm, cmap='pink')
    plt.title('NIR Band')
    plt.axis('off')
    nir_band_png = os.path.join(output_dir, 'nir_band_image.png')
    plt.savefig(nir_band_png)
    plt.close()

    # Plot Surface Reflectance Histogram and save it as a PNG
    reflectance_data = np.concatenate((red_band_data.flatten(), nir_band_data.flatten(), green_band_data.flatten()))
    plt.hist(reflectance_data, bins=100, color='purple', alpha=0.7)
    plt.title('Surface Reflectance Data Histogram (Red, NIR, Green)')
    plt.xlabel('Reflectance Value')
    plt.ylabel('Frequency')
    plt.grid(True)
    histogram_png = os.path.join(output_dir, 'surface_reflectance_histogram.png')
    plt.savefig(histogram_png)
    plt.close()

    # True Color Image Creation
    trueColor_path = os.path.join(output_dir, 'LandsatTrueColor.tiff')
    with rasterio.open(trueColor_path, 'w', driver='Gtiff',
                      width=red_band.width, height=red_band.height,
                      count=3,
                      crs=red_band.crs,
                      transform=red_band.transform,
                      dtype=red_band.dtypes[0]) as trueColor:
        trueColor.write(red_band_data, 1)   # Red
        trueColor.write(green_band_data, 2) # Green
        trueColor.write(nir_band_data, 3)   # NIR

    # Convert True Color TIFF to PNG
    true_color_image = Image.open(trueColor_path)
    true_color_png_path = os.path.join(output_dir, 'LandsatTrueColor.png')
    true_color_image.save(true_color_png_path)

    # Export False Color Image (NIR, Red, Green)
    falseColor_path = os.path.join(output_dir, 'LandsatFalseColor.tiff')
    with rasterio.open(falseColor_path, 'w', driver='Gtiff',
                      width=red_band.width, height=red_band.height,
                      count=3,
                      crs=red_band.crs,
                      transform=red_band.transform,
                      dtype=red_band.dtypes[0]) as falseColor:
        falseColor.write(nir_band_data, 1)  # NIR
        falseColor.write(red_band_data, 2)  # Red
        falseColor.write(green_band_data, 3)  # Green

    # Convert False Color TIFF to PNG
    false_color_image_2 = Image.open(falseColor_path)
    false_color_png_path_2 = os.path.join(output_dir, 'LandsatFalseColor.png')
    false_color_image_2.save(false_color_png_path_2)

    # Close the bands
    red_band.close()
    green_band.close()
    nir_band.close()

# Function to get PNG file paths
def get_png_files(output_dir):
    png_files = []
    for filename in os.listdir(output_dir):
        if filename.endswith('.png'):
            png_files.append(os.path.join(output_dir, filename))
    return png_files

# Define the endpoint to process satellite data
@app.route('/process_satellite_data', methods=['POST'])
def process_satellite_data():
    data = request.json
    lat = data.get('lat')
    lon = data.get('lon')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    max_cloud_cover = data.get('max_cloud_cover')

    # Download and process GeoTIFF images
    download_dir = output_dir
    scene_id = download_recent_geotiff(lat, lon, start_date, end_date, max_cloud_cover, download_dir)

    if scene_id is None:
        return jsonify({"error": "Failed to download GeoTIFF images."}), 500

    # Get bounding box coordinates from MTL metadata
    xmin, ymin, xmax, ymax = get_bounding_box(scene_id, download_dir)

    # Process the GeoTIFF images and generate PNGs
    png_files = get_png_files(output_dir)

    # Return the PNG image paths and bounding box coordinates
    return jsonify({
        "png_files": png_files,
        "bounding_box": {
            "xmin": xmin,
            "ymin": ymin,
            "xmax": xmax,
            "ymax": ymax
        }
    })

if __name__ == '__main__':
    app.run(debug=True)