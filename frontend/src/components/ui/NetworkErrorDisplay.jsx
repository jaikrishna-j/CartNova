import React from 'react';
import Lottie from 'lottie-react';
import offlineAnimation from '@/assets/animations/no-network-connection.json';

const NetworkErrorDisplay = ({ title, message }) => {
  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-blue-100 to-purple-100'>
      
      {/* 1. Animation size is now smaller on mobile screens */}
      <div className='w-48 h-48 sm:w-64 sm:h-64 mb-4'>
        <Lottie 
          animationData={offlineAnimation} 
          loop={true} 
          autoplay={true} 
        />
      </div>
      
      {/* 2. Title font size is smaller on mobile screens */}
      <h1 className='text-3xl sm:text-5xl font-extrabold text-indigo-700 mb-3 text-center tracking-tight'>
        {title || "Connection Lost!"}
      </h1>
      
      {/* 3. Paragraph font size is smaller on mobile screens */}
      <p className='text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 text-center max-w-xl leading-relaxed'>
        {message || "We're having trouble reaching our servers. Please check your network connection and try again. If the problem continues, it might be an issue on our end."}
      </p>
      
      <button 
        onClick={() => window.location.reload()}
        className='relative px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out group'
      >
        <span className='absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
        <span className='relative z-10'>Refresh Page 🚀</span>
      </button>
      
    </div>
  );
};

export default NetworkErrorDisplay;