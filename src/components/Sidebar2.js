"use client"

import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SatellitePassoverNotifier from "@/components/SatellitePassoverNotifier";

const Sidebar2 = ({ lat, lng, cloudCover, tiffFiles, selectedTiff, onTiffSelect }) => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Results</h1>
      <h3 className="text-lg font-bold mb-2">Please allow up to 5 minutes for the data to be processed and displayed.</h3>
      <h3 className="text-lg font-bold mb-2">Selected Coordinates</h3>
      <p className="mb-2"><strong>Latitude:</strong> {lat || 'Not provided'}</p>
      <p className="mb-2"><strong>Longitude:</strong> {lng || 'Not provided'}</p>
      <p className="mb-2"><strong>Cloud Cover:</strong> {cloudCover || 'Not provided'}</p>
      
      <div className="mt-4">
        <label htmlFor="tiff-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select TIFF Image
        </label>
        <Select onValueChange={onTiffSelect} value={selectedTiff}>
          <SelectTrigger>
            <SelectValue placeholder="Select a TIFF file" />
          </SelectTrigger>
          <SelectContent>
            {tiffFiles.map((tiff, index) => (
              <SelectItem key={index} value={tiff}>
                {tiff.split('/').pop()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Enter your email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter your email"
        />
      </div>

      <SatellitePassoverNotifier latitude={lat} longitude={lng} />
    </div>
  );
};

export default Sidebar2;