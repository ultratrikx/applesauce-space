import React from 'react';
import Hero from './Hero';
import HowItWorks from './HowItWorks';

const MainPage = () => {
  return (
    <div className="flex flex-col bg-white">
      <Hero />
      <HowItWorks />
    </div>
  );
};

export default MainPage;