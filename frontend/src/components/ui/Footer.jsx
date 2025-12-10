import React from 'react';
import { FaLinkedinIn, FaGithub, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Store', path: '/store' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <footer className='bg-gray-900 text-white transition-colors duration-300'>
      <div className='max-w-7xl mx-auto px-4 py-6 sm:py-8 md:py-12 sm:px-6 lg:px-8'>
        
        {/* Main Content Grid: Changed to 2 columns for balanced alignment */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 text-center sm:text-left'>
          
          {/* Section 1: Brand Identity & Social Icons */}
          <div className='space-y-3 sm:space-y-4 flex flex-col items-center sm:items-start'>
            <h3 className='text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400'>
              CARTNOVA
            </h3>
            <p className='text-xs sm:text-sm text-gray-400'>
              The future of E-commerce, delivered.
            </p>
            <div className='flex justify-center sm:justify-start space-x-2 sm:space-x-3 pt-2 text-base sm:text-lg md:text-xl'>
              {/* LinkedIn */}
              <a href='https://www.linkedin.com/in/jaikrishna-j/' target="_blank" rel="noopener noreferrer" aria-label='LinkedIn' className='p-2 bg-gray-800 rounded-lg text-gray-400 hover:bg-sky-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg'>
                <FaLinkedinIn />
              </a>
              {/* GitHub */}
              <a href='https://github.com/jaikrishna-j' target="_blank" rel="noopener noreferrer" aria-label='GitHub' className='p-2 bg-gray-800 rounded-lg text-gray-400 hover:bg-gray-600 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg'>
                <FaGithub />
              </a>
              {/* Email */}
              <a href='mailto:jaikrishnajaisankar2005@gmail.com' aria-label='Email' className='p-2 bg-gray-800 rounded-lg text-gray-400 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg'>
                <FaEnvelope />
              </a>
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div className='space-y-3 sm:space-y-4'>
            <h4 className='text-sm sm:text-base font-bold text-gray-400 uppercase tracking-wider'>Quick Links</h4>
            <div className='flex flex-col space-y-2'>
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className='text-gray-300 no-underline text-sm sm:text-base hover:text-indigo-400 hover:underline transition-colors duration-200'
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Separator and Copyright */}
        <div className='mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-800 text-center'>
          <p className='text-xs sm:text-sm text-gray-500'>
            &copy; {currentYear} CartNova. All rights reserved.
          </p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;