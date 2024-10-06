"use client";

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"

const targetAudiences = [
  "scientist",
  "researcher",
  "environmentalist",
  "policymaker",
  "student",
  "entrepreneur",
  "data analyst",
  "urban planner",
  "agriculturist",
  "meteorologist"
]

const LandingPage = () => {
  const router = useRouter();
  const [currentAudience, setCurrentAudience] = useState(0)

  const navigateToMap = () => {
    router.push('/map');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAudience((prev) => (prev + 1) % targetAudiences.length)
    }, 2000) // Change every 2 seconds

    return () => clearInterval(interval)
  }, [])
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-start justify-center p-4">
      <div className="text-left space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 flex flex-wrap justify-left items-left">
          Are you a{' '}
          {/* <div className="relative inline-block w-64 h-16 overflow-hidden ml-2">
            {targetAudiences.map((audience, index) => (
              <span 
                key={audience} 
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                  currentAudience === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="text-green-500">{audience}</span>
              </span>
            ))}
          </div> */}
        </h1>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 flex flex-wrap justify-left items-left" >
            <div className="relative inline-block auto">
            {targetAudiences.map((audience, index) => (
              <span 
                key={audience} 
                className={`absolute inset-0 flex items-center justify-left transition-opacity duration-500 ${
                  currentAudience === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="text-green-500">{audience}</span>
              </span>
            ))}
          </div>
        </h1>
        <h2 className="text-2xl md:text-3xl text-gray-700">
          wanting to digest Landsat data?
        </h2>
        <Button 
          className="text-lg px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded"
          onClick={navigateToMap}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;