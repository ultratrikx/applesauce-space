"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Sidebar({ updateMap, latitude, longitude, onLoadGeoTIFF }) {
  const [lat, setLat] = useState(latitude);
  const [lng, setLng] = useState(longitude);
  const [showSatellitePassover, setShowSatellitePassover] = useState(false);
  const [cloudCover, setCloudCover] = useState(10);
  const [selectedBand, setSelectedBand] = useState('band1');
  const router = useRouter();

  useEffect(() => {
    setLat(latitude);
    setLng(longitude);
  }, [latitude, longitude]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMap(lat, lng);
  };

  const handleLoadGeoTIFF = () => {
    onLoadGeoTIFF();
    setShowSatellitePassover(true);
    const searchParams = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      cloudCover: cloudCover.toString(),
      // selectedBand: selectedBand
    }).toString();
    router.push(`/results?${searchParams}`);
  };

  const handleCloudCoverChange = (e) => {
    setCloudCover(e.target.value);
  };

  const handleSelectChange = (value) => {
    setSelectedBand(value);
  };

  return (
    <div className="fixed top-0 right-0 w-1/4 h-full bg-background border-l border-border p-6 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Set Coordinates</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="latitude" className="text-sm font-medium text-foreground">
                Latitude:
              </label>
              <Input
                id="latitude"
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Enter latitude"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="longitude" className="text-sm font-medium text-foreground">
                Longitude:
              </label>
              <Input
                id="longitude"
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="Enter longitude"
              />
            </div>
          </form>
          <div className="mt-6 mb-4">
            <h3 className="text-lg font-medium mb-2">Adjust Cloud Cover</h3>
            <Input
              type="number"
              value={cloudCover}
              onChange={handleCloudCoverChange}
              max={100}
              min={0}
              step={1}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {/* <div className="mt-6 mb-4">
            <h3 className="text-lg font-medium mb-2">Select Band</h3>
            <Select value={selectedBand} onValueChange={handleSelectChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Band" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="band1">Band 1</SelectItem>
                <SelectItem value="band2">Band 2</SelectItem>
                <SelectItem value="band3">Band 3</SelectItem>
                <SelectItem value="band4">Band 4</SelectItem>
                <SelectItem value="band5">Band 5</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Update Map
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Load Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleLoadGeoTIFF}>Load Data</Button>
        </CardContent>
      </Card>
    </div>
  );
}