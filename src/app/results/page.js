"use client"

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const Map = dynamic(() => import('../../components/Map'), { ssr: false });
const Sidebar2 = dynamic(() => import('../../components/Sidebar2'), { ssr: false });

const ResultsPage = () => {
  const searchParams = useSearchParams();
  
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const cloudCover = searchParams.get('cloudCover');
//   const selectedBand = searchParams.get('selectedBand');

  const [boundingBox, setBoundingBox] = useState(null);
  const [tiffFiles, setTiffFiles] = useState([]);
  const [selectedTiff, setSelectedTiff] = useState('');
  const [proxyTiffUrl, setProxyTiffUrl] = useState('');
  const [error, setError] = useState(null);

//   const adj = 5.0
  // Hardcoded values for testing
  const boundingBoxTEST = {
    xmax: -3.10981,
    xmin: -6.56437,
    ymax: 51.38369, //- adj,
    ymin: 49.14807 //- adj
  };
  const tiffFilesTEST = [
    "https://terraview-applesauce.s3.amazonaws.com/FALSE_COLOUR.tif",
    "https://terraview-applesauce.s3.amazonaws.com/TRUECOLOUR.tif",
    "https://terraview-applesauce.s3.amazonaws.com/COLOURED_NDVI.tif",
    "https://terraview-applesauce.s3.amazonaws.com/HISTOGRAM.tif"
  ];

  useEffect(() => {
    setBoundingBox(boundingBoxTEST);
    setTiffFiles(tiffFilesTEST);
    if (tiffFilesTEST.length > 0) {
        // update the tiff file being rendered based on the option selected
        if (selectedTiff) {
            const encodedUrl = encodeURIComponent(selectedTiff);
            setProxyTiffUrl(`/api/proxy-tiff?url=${encodedUrl}`);
        }

      setSelectedTiff(tiffFilesTEST[0]); // Select the first TIFF file by default
    }
  }, []);

  useEffect(() => {
    if (selectedTiff) {
      const encodedUrl = encodeURIComponent(selectedTiff);
      setProxyTiffUrl(`/api/proxy-tiff?url=${encodedUrl}`);
    }
  }, [selectedTiff]);

  const handleTiffSelect = (value) => {
    setSelectedTiff(value);
    setError(null);  // Clear any previous errors
  };

  return (
    <div className="flex h-screen">
      <Sidebar2
        lat={lat}
        lng={lng}
        cloudCover={cloudCover}
        // selectedBand={selectedBand}
        tiffFiles={tiffFiles}
        selectedTiff={selectedTiff}
        onTiffSelect={handleTiffSelect}
      />
      <div className="flex-grow">
        {error && <div className="text-red-500">{error}</div>}
        <Map
          lat={parseFloat(lat)}
          lng={parseFloat(lng)}
          boundingBox={boundingBox}
          selectedTiff={proxyTiffUrl}
        />
      </div>
    </div>
  );
};

export default ResultsPage;  


//"use client"

//     import React, { useState, useEffect } from 'react';
//     import { useSearchParams } from 'next/navigation';
//     import axios from 'axios';
//     import dynamic from 'next/dynamic';
//     import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

//     const Map = dynamic(() => import('../../components/Map'), { ssr: false });
//     const Sidebar2 = dynamic(() => import('../../components/Sidebar2'), { ssr: false });

//     const ResultsPage = () => {
//     const searchParams = useSearchParams();
    
//     const lat = searchParams.get('lat');
//     const lng = searchParams.get('lng');
//     const cloudCover = searchParams.get('cloudCover');
//     const selectedBand = searchParams.get('selectedBand');
//     const landsatAPI = "http://EXAMPLE.COM/"

//     const [boundingBox, setBoundingBox] = useState(null);
//     const [tiffFiles, setTiffFiles] = useState([]);
//     const [selectedTiff, setSelectedTiff] = useState('');
//     const [proxyTiffUrl, setProxyTiffUrl] = useState('');

//     const boundingBoxTEST = {
//     xmax: -3.10981,
//     xmin: -6.56437,
//     ymax: 51.38369,
//     ymin: 49.14807
//   };
//   const tiffFilesTEST = [
//     "https://terraview-applesauce.s3.amazonaws.com/compressed_false_color_image.tif",
//     "https://terraview-applesauce.s3.amazonaws.com/compressed_LandsatTrueColor.tif",
//     "https://terraview-applesauce.s3.amazonaws.com/compressed_ndvi_image_colored.tif",
//     "https://terraview-applesauce.s3.amazonaws.com/compressed_surface_reflectance_histogram.tif"
//   ];
//   useEffect(() => {
//     setBoundingBox(boundingBoxTEST);
//     setTiffFiles(tiffFilesTEST);
//     if (tiffFilesTEST.length > 0) {
//       setSelectedTiff(tiffFilesTEST[2]);
//     }
//   }, []);

//   useEffect(() => {
//     if (selectedTiff) {
//       const encodedUrl = encodeURIComponent(selectedTiff);
//       setProxyTiffUrl(`/api/proxy-tiff?url=${encodedUrl}`);
//     }
//   }, [selectedTiff]);

//   const handleTiffSelect = (value) => {
//     setSelectedTiff(value);
//   };


//     return (
        
//         <div className="flex h-screen">
//         <Sidebar2
//             lat={lat}
//             lng={lng}
//             cloudCover={cloudCover}
//             selectedBand={selectedBand}
//             tiffFiles={tiffFiles}
//             selectedTiff={selectedTiff}
//             onTiffSelect={handleTiffSelect}
//         />
//         <div className="flex-grow">
//             <Map
//             lat={parseFloat(lat)}
//             lng={parseFloat(lng)}
//             boundingBox={boundingBoxTEST}
//             selectedTiff={proxyTiffUrl}
//             />
//         </div>
//         </div>
//     );
//     };

//     export default ResultsPage;








// "use client"

// import React, { useState, useEffect, useCallback } from 'react';
// import { useSearchParams } from 'next/navigation';
// import axios from 'axios';
// import dynamic from 'next/dynamic';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// const Map = dynamic(() => import('../../components/Map'), { ssr: false });
// const Sidebar2 = dynamic(() => import('../../components/Sidebar2'), { ssr: false });

// // Custom hook for API calls
// const useLandsatData = (lat, lng, cloudCover) => {
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let isMounted = true;
//     const controller = new AbortController();

//     const fetchData = async () => {
//       if (!lat || !lng || !cloudCover) {
//         setIsLoading(false);
//         return;
//       }

//       setIsLoading(true);
//       setError(null);

//       try {
//         console.log('Fetching Landsat data...'); // Debug log
//         const response = await axios.post("http://localhost:5000/process_satellite_data", {
//           lat: parseFloat(lat),
//           lon: parseFloat(lng),
//           start_date: new Date(Date.now() - 5 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//           end_date: new Date().toISOString().split('T')[0],
//           max_cloud_cover: cloudCover
//         }, {
//           timeout: 900000,
//           signal: controller.signal
//         });

//         if (isMounted) {
//           console.log('Landsat data received:', response.data); // Debug log
//           setData(response.data);
//         }
//       } catch (err) {
//         if (axios.isCancel(err)) {
//           console.log('Request canceled', err.message);
//         } else {
//           console.error('Error fetching Landsat data:', err);
//           if (isMounted) {
//             setError('Failed to fetch Landsat data. Please try again.');
//           }
//         }
//       } finally {
//         if (isMounted) {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchData();

//     return () => {
//       isMounted = false;
//       controller.abort();
//     };
//   }, [lat, lng, cloudCover]);

//   return { data, isLoading, error };
// };

// const ResultsPage = () => {
//   const searchParams = useSearchParams();
  
//   const lat = searchParams.get('lat');
//   const lng = searchParams.get('lng');
//   const cloudCover = searchParams.get('cloudCover');
//   const selectedBand = searchParams.get('selectedBand');

//   const { data, isLoading, error } = useLandsatData(lat, lng, cloudCover);

//   const [selectedTiff, setSelectedTiff] = useState('');

//   useEffect(() => {
//     if (data && data.tiff_files && data.tiff_files.length > 0) {
//       setSelectedTiff(data.tiff_files[0]);
//     }
//   }, [data]);

//   const handleTiffSelect = (value) => {
//     setSelectedTiff(value);
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="flex h-screen">
//       <Sidebar2
//         lat={lat}
//         lng={lng}
//         cloudCover={cloudCover}
//         selectedBand={selectedBand}
//         tiffFiles={data?.tiff_files || []}
//         selectedTiff={selectedTiff}
//         onTiffSelect={handleTiffSelect}
//       />
//       <div className="flex-grow">
//         <Map
//           lat={parseFloat(lat)}
//           lng={parseFloat(lng)}
//           boundingBox={data?.bounding_box}
//           selectedTiff={selectedTiff}
//         />
//       </div>
//     </div>
//   );
// };

// export default ResultsPage;