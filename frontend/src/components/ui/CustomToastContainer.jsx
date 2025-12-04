import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * Injects a <style> tag to define our new "cool" keyframe animations.
 * We'll create a "bouncy" entrance.
 */
const CustomToastAnimations = () => (
  <style>{`
    /* A "bouncy" entrance animation:
      1. Starts off-screen (right) and small.
      2. Shoots past its final position and gets bigger.
      3. Settles back into its final position.
    */
    @keyframes hot-toast-bouncy-enter {
      0% {
        transform: translateX(120%) scale(0.7);
        opacity: 0;
      }
      60% {
        transform: translateX(-5%) scale(1.05); /* Overshoots */
        opacity: 1;
      }
      100% {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
    }
    
    /* A standard fade and slide-out exit */
    @keyframes hot-toast-bouncy-exit {
      from {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
      to {
        transform: translateX(120%) scale(0.7);
        opacity: 0;
      }
    }
  `}</style>
);

/**
 * This component wraps the React Hot Toast Toaster and sets all the
 * global styles, including our new custom animations.
 */
const CustomToastContainer = () => {
  return (
    <>
      {/* 1. This adds our new @keyframes to the page */}
      <CustomToastAnimations />
      
      <Toaster
        position="top-right"
        reverseOrder={false}
        
        // 2. We use 'containerStyle' to set the CSS variables
        // that react-hot-toast uses for its animations.
        containerStyle={{
          '--rht-animation-enter': 'hot-toast-bouncy-enter 0.6s',
          '--rht-animation-exit': 'hot-toast-bouncy-exit 0.4s',
        }}
        
        toastOptions={{
          // Default duration for all toasts
          duration: 3000,

          // Default styles for specific toast types
          success: {
            style: {
              background: '#28a745',
              color: 'white',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#dc3545',
              color: 'white',
            },
          },
        }}
      />
    </>
  );
};

export default CustomToastContainer;