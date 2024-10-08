"use client";
import React from "react";
import dynamic from 'next/dynamic';
import LandsatFalseColourMap from "../../../components/LandsatFalseColourMap";
export default function HomePage() {
  const latitude = 40.7128; // Example latitude
  const longitude = -74.0060; // Example longitude

  return (
    <div>
      <LandsatFalseColourMap/>
    </div>
  );
}