"use client"

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

import SatellitePassoverNotifier from './SatellitePassoverNotifier';

export default function Sidebar({ updateMap, latitude, longitude, onLoadGeoTIFF }) {
  const [lat, setLat] = useState(latitude);
  const [lng, setLng] = useState(longitude);
  const [showSatellitePassover, setShowSatellitePassover] = useState(false);
  
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
          <Slider defaultValue={[33]} max={100} step={1} />
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
          <Button className="w-full" onClick={handleLoadGeoTIFF} >Load GeoTIFF</Button>
        </CardContent>
      </Card>
      {showSatellitePassover && <SatellitePassoverNotifier latitude={lat} longitude={lng} />}
    </div>
  );
}