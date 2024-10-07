"use client";

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import Image from 'next/image';

const Hero = () => {
  const router = useRouter();

  const navigateToMap = () => {
    router.push('/map');
  };

  const professions = useMemo(() => [
    'meteorologist ⛅️',
    'farmer 🌾',
    'educator 📚',
    'artist 🎨',
    'pilot ✈️',
    'researcher 🧪',
    'scientist 🔬'
  ], []);

  const [profession, setProfession] = useState('');
  useEffect(() => {
    const randomProfession = professions[Math.floor(Math.random() * professions.length)];
    setProfession(randomProfession);
  }, [professions]);

  return (
    <div className="flex relative z-10 flex-col items-start px-20 pt-96 pb-32 w-full min-h-[1083px] max-md:px-5 max-md:py-24 max-md:max-w-full">
      <Image
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6c015782656993fe3eccdb2f1aa6a9e7889ece3542f4278560d4704ef12ea6bd?placeholderIfAbsent=true&apiKey=5b8e72dd7c7f47caad1dc05862aaf1eb"
        alt="Background"
        layout="fill"
        objectFit="cover"
        priority
      />
      <div className="flex relative flex-col mb-0 w-full max-w-[1362px] max-md:mb-2.5 max-md:max-w-full">
        <div className="self-start text-8xl font-extrabold text-green-700 max-md:max-w-full max-md:text-4xl">
          {profession}
        </div>
        <div className="flex flex-col items-start pl-2 mt-2 max-md:max-w-full">
          <div className="text-5xl font-extrabold text-slate-900 max-md:max-w-full max-md:text-4xl">
            wanting to digest Landsat data?
          </div>
          <Button className="px-16 py-7 mt-12 max-w-full text-4xl font-bold leading-tight text-white bg-green-700 rounded-3xl w-[480px] max-md:px-5 max-md:mt-10" onClick={navigateToMap}>
            Get Started
          </Button>
          <div className="self-stretch mt-32 text-3xl font-medium text-slate-900 max-md:mt-10 max-md:max-w-full">
            Landsat data? We&apos;ve got you covered. For anyone looking to get high quality, up-to-date Landsat data, TerraView is the place to be. We provide a simple, easy-to-use interface for you to access the data you need. Get started today!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;