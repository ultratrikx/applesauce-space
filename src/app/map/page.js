"use client";
import React from "react";
import dynamic from 'next/dynamic';
const MapComponent = dynamic(() => import('../../components/MapComponent'), { ssr: false });

export default function HomePage() {
  const latitude = 40.7128; // Example latitude
  const longitude = -74.0060; // Example longitude

  return (
    <div>
      <MapComponent lat={latitude} lng={longitude} />
    </div>
  );
}