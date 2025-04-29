import React, { useRef } from 'react';
import Deals from './Deals';

function Banner() {
  // Create a reference to the next section
  const nextSectionRef = useRef(null);

  // Function to scroll to the next section
  const handleScrollToNextSection = () => {
    nextSectionRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div>
      {/* Banner Section */}
      <div className="relative w-full h-screen flex items-center justify-center text-center ">
        <video
          src="/src/assets/website video.mp4"
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-35"></div>

        {/* Headings */}
        <div className="relative z-10 pt-40">
          <h1 className="text-5xl font-bold text-white">
            Feast Your Senses <br />
            <span className="text-[#FC8A06]">Fast and Fresh</span>
          </h1>

          {/* Get Started Button */}
          <button
            onClick={handleScrollToNextSection}
            className="mt-8 text-xl py-5  text-[#FC8A06] border border-[#FC8A06] rounded-lg hover:bg-[#FC8A06] hover:text-white px-8 z-10"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Deals Section */}
      <Deals nextSectionRef={nextSectionRef} />
    </div>
  );
}

export default Banner;
