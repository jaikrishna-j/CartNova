import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import notFoundAnimation from '@/assets/animations/404-not-found.json'; 

const NotFoundPage = () => {
  return (
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-gray-50 to-indigo-50 py-8 transition-colors duration-300'>
      
      {/* Animation */}
      <div className='w-full max-w-[200px] sm:max-w-[250px] mb-4'>
        <Lottie 
          animationData={notFoundAnimation} 
          loop={true} 
          autoplay={true} 
          className="mx-auto" 
        />
      </div>

      {/* Text content */}
      <div>
        <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tighter mb-3 sm:mb-4 transition-colors duration-300'>
          Oops! Page Not Found
        </h1>
        
        <p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-3 sm:mb-4 max-w-2xl mx-auto transition-colors duration-300'>
          We can't seem to find the page you're looking for.
        </p>
        
        <p className='text-xs sm:text-sm md:text-base text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto transition-colors duration-300'>
          This might have happened because you typed the address incorrectly, the page was moved, or the link you followed is out of date.
        </p>

        <Link 
          to='/' 
          className='relative inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-sm sm:text-base md:text-lg rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl no-underline border-none'
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage;