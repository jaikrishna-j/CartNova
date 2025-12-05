import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import relaxedWeekendCasual from '../../assets/header-images/Relaxed-Weekend-Casual.png';
import polishedWorkwear from '../../assets/header-images/Polished-Workwear.png';
import nikeShoe from '../../assets/header-images/Nike-Shoe.png';
import modernStreetwear from '../../assets/header-images/Modern-Streetwear.png';
import oldMoney from '../../assets/header-images/Old-Money.png';
import urbanStrideStyle from '../../assets/header-images/Urban-Stride-Style.png';
import dynamicWorkwearFlow from '../../assets/header-images/Dynamic-Workwear-Flow.png';
import activeUrbanMoment from '../../assets/header-images/Active-Urban-Moment.png';
import eveningEntranceLook from '../../assets/header-images/Evening-Entrance-Look.png';
import effortlessSustainableWalk from '../../assets/header-images/Effortless-Sustainable-Walk.png';

const images = [
  relaxedWeekendCasual,
  polishedWorkwear,
  nikeShoe,
  modernStreetwear,
  oldMoney,
  urbanStrideStyle,
  dynamicWorkwearFlow,
  activeUrbanMoment,
  eveningEntranceLook,
  effortlessSustainableWalk,
];

const Header = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef(null);

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    intervalRef.current = setInterval(goToNext, 2500); // 2.5 seconds
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleManualNavigation = (direction) => {
    clearInterval(intervalRef.current);
    if (direction === 'next') {
      goToNext();
    } else {
      goToPrevious();
    }
    intervalRef.current = setInterval(goToNext, 2500); // 2.5 seconds
  };

  return (
    <header className='relative min-h-[80vh] w-full overflow-hidden text-white'>
      {/* --- LAYER 1: IMAGE CAROUSEL (BACKGROUND) --- */}
      <div className='absolute inset-0 z-0'>
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      {/* --- LAYER 2: OVERLAY & CONTENT (FOREGROUND) --- */}
      <div className='relative z-10 flex h-full min-h-[80vh] items-center justify-between bg-gradient-to-r from-black/50 via-black/40 to-black/50 px-4 sm:px-6 lg:px-8'>
        {/* Left Arrow */}
        <button
          onClick={() => handleManualNavigation('prev')}
          className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50'
          aria-label='Previous image'
        >
          <FaChevronLeft className='text-2xl text-white transition-transform duration-300' />
        </button>

        {/* Center Text Content */}
        <div className='flex flex-col items-center text-center px-4'>
          <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight drop-shadow-2xl bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent animate-fade-in'>
            Welcome to Your Favorite Store
          </h1>
          <p className='text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl drop-shadow-lg font-medium'>
            Discover the latest trends with our modern collection
          </p>
          <a
            href='#products'
            className='inline-block bg-indigo-600 text-white text-base sm:text-lg no-underline font-semibold rounded-full px-6 py-2.5 sm:px-8 sm:py-3 transition-all duration-300 hover:bg-indigo-700 shadow-2xl hover:shadow-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
          >
            Shop Now
          </a>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleManualNavigation('next')}
          className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50'
          aria-label='Next image'
        >
          <FaChevronRight className='text-2xl text-white transition-transform duration-300' />
        </button>
      </div>
    </header>
  );
};

export default Header;