import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import notFoundAnimation from '@/assets/animations/404-not-found.json'; 

const NotFoundPage = () => {
  return (
    // --- THIS IS THE FIX ---
    // 1. Changed min-h-screen to min-h-[calc(100vh-4rem)]. This subtracts the navbar's height.
    // NOTE: '4rem' (64px) is a standard navbar height. If yours is different, adjust this value (e.g., 5rem for 80px).
    // 2. Added 'py-8' to give it some vertical padding and prevent it from feeling cramped.
    <div className='min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-gray-900 to-indigo-900 py-8'>
      
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
        <h1 className='text-4xl sm:text-6xl font-extrabold text-white tracking-tighter mb-4'>
          Oops! Page Not Found
        </h1>
        
        <p className='text-lg sm:text-xl text-gray-300 mb-4 max-w-2xl mx-auto'>
          We can't seem to find the page you're looking for.
        </p>
        
        <p className='text-base text-gray-400 mb-8 max-w-2xl mx-auto'>
          This might have happened because you typed the address incorrectly, the page was moved, or the link you followed is out of date.
        </p>

        <Link 
          to='/' 
          className='relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-lg rounded-full shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl no-underline'
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage;