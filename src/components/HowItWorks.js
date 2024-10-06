import React from 'react';

const HowItWorks = () => {
  return (
    <div className="flex overflow-hidden flex-col ml-3 bg-white rounded-sm border border-solid border-white border-opacity-10 max-md:max-w-full">
      <div className="flex relative flex-col w-full min-h-[1080px] max-md:max-w-full">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/e30d09288efa5a23879d875bfd934c20cedcd6e556d49ebdd29a7dbe887dc07d?placeholderIfAbsent=true&apiKey=5b8e72dd7c7f47caad1dc05862aaf1eb" className="object-cover absolute inset-0 size-full" alt="Background" />
        <div className="flex relative flex-col items-center px-16 pt-2 w-full min-h-[1080px] pb-[713px] max-md:px-5 max-md:pb-24 max-md:max-w-full">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/94e1adc55f2d503f08ce18f3ac97f3323924289b156d0053e7c593c3ea8715a2?placeholderIfAbsent=true&apiKey=5b8e72dd7c7f47caad1dc05862aaf1eb" className="object-cover absolute inset-0 size-full" alt="Overlay" />
          <div className="relative mb-0 w-full max-w-[1551px] max-md:mb-2.5 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <div className="flex flex-col w-[67%] max-md:ml-0 max-md:w-full">
                <div className="flex relative flex-col grow mt-3 max-md:mt-10 max-md:max-w-full">
                  <div className="self-start text-5xl font-extrabold text-slate-900 max-md:max-w-full max-md:text-4xl">
                    How <span className="text-green-700">TerraView</span> works
                  </div>
                  <div className="mt-6 text-3xl font-medium leading-10 text-black max-md:max-w-full">
                    Satellite's are hard to keep track of, who knows when they pass by.
                    TerraView will notify you of when the landsat satellite will pass over you.
                    Helps you figure when you need to gather your observations.
                    You can view the various bands of data, whether its NDVI, water
                    usage or urbanization information. This helps you make informed
                    decisions about your land.
                  </div>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
                <div className="flex relative shrink-0 mx-auto max-w-full rounded-3xl bg-zinc-300 h-[360px] w-[480px] max-md:mt-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;