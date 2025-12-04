import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';
import Lottie from 'lottie-react';
import loginAnimation from '@/assets/animations/Login.json';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '@/api';
import Error from '../ui/Error';
import { AuthContext } from '@/context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

// --- Style Definitions ---
const pageStyle = 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4';
const containerStyle = 'w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden';
const leftPanelStyle = 'hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center';
const rightPanelStyle = 'p-8 sm:p-12';
const titleStyle = 'text-3xl font-bold text-gray-900 dark:text-white';
const subtitleStyle = 'text-gray-500 dark:text-gray-400 mt-2';
const linkStyle = 'font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 ml-1';
const formStyle = 'space-y-6'; // Original spacing for login
const inputGroupStyle = 'relative mt-1';
const labelStyle = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
const iconStyle = 'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none';
const iconSvgStyle = 'h-5 w-5 text-gray-400';
const inputStyle = 'block w-full pl-10 pr-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500';
const passwordInputStyle = 'block w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'; // Added pr-10
const eyeButtonStyle = 'absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors focus:outline-none';
const submitButtonStyle = 'w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50';
const separatorStyle = 'relative flex items-center justify-center my-6';
const separatorLineStyle = 'w-full h-px bg-gray-300 dark:bg-gray-600';
const separatorTextStyle = 'absolute px-3 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400';
const socialButtonStyle = 'w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';
const bottomTextStyle = 'text-sm text-center mt-8';


const LoginPage = () => {
  const { setIsAuthenticated, get_username } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // --- (State variables remain the same) ---
  const [username, setUsername] = useState(''); /* ... */
  const [password, setPassword] = useState(''); /* ... */
  const [loading, setLoading] = useState(false); /* ... */
  const [error, setError] = useState(''); /* ... */
  const [showPassword, setShowPassword] = useState(false); /* ... */

  // --- (Handlers: handleStandardSubmit, handleGoogleLoginSuccess, handleGoogleLoginError, triggerGoogleLogin remain the same) ---
  function handleStandardSubmit(e) { /* ... */ }
  const handleGoogleLoginSuccess = async (codeResponse) => { /* ... */ };
  const handleGoogleLoginError = (error) => { /* ... */ };
  const triggerGoogleLogin = useGoogleLogin({ onSuccess: handleGoogleLoginSuccess, onError: handleGoogleLoginError, flow: 'auth-code' });

  // --- (Animation variants remain the same) ---
  const cardVariants = { /* ... */ };
  const itemVariants = { /* ... */ };

  return (
    <div className={pageStyle}>
      <div className={containerStyle}>
        {/* Left Side */}
        <div className={leftPanelStyle}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}><Lottie animationData={loginAnimation} loop={true} className='w-64 h-64' /></motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}><h1 className='text-4xl font-extrabold tracking-wider mt-4'>Welcome Back!</h1><p className='mt-4 text-indigo-200 max-w-xs mx-auto'>It's great to see you again. Your next premium find is just a click away.</p></motion.div>
        </div>
        {/* Right Side */}
        <motion.div className={rightPanelStyle} variants={cardVariants} initial='hidden' animate='visible'>
          <motion.div variants={itemVariants} className='text-center mb-8'>{error && <Error error={error} />}<h2 className={titleStyle}>Sign In to Your Account</h2><p className={subtitleStyle}>Or{' '} <Link to='/register' className={linkStyle}>Create a new account</Link></p></motion.div>

          <form onSubmit={handleStandardSubmit}>
            <div className={formStyle}>
              {/* Username/Email Field */}
              <motion.div variants={itemVariants}>
                 <label htmlFor='username' className={labelStyle}>Email or Username</label>
                 <div className={inputGroupStyle}> <span className={iconStyle}><FiMail className={iconSvgStyle} /></span> <input type='text' id='username' value={username} onChange={(e) => setUsername(e.target.value)} className={inputStyle} placeholder='Enter your email or username' required /></div>
              </motion.div>
              {/* Password Field */}
              <motion.div variants={itemVariants}>
                 <div className='flex justify-between items-center mb-1'> <label htmlFor='password' className={labelStyle}>Password</label> <Link to='/forgot-password' className='text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400'>Forgot Password?</Link> </div>
                 <div className={inputGroupStyle}> <span className={iconStyle}><FiLock className={iconSvgStyle} /></span> <input type={showPassword ? 'text' : 'password'} id='password' value={password} onChange={(e) => setPassword(e.target.value)} className={passwordInputStyle} placeholder='Enter your password' required /> <button type='button' onClick={() => setShowPassword(!showPassword)} className={eyeButtonStyle}>{showPassword ? <FiEyeOff /> : <FiEye />}</button> </div>
              </motion.div>
              {/* Submit Button */}
              <motion.button variants={itemVariants} whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(79, 70, 229, 0.4)' }} whileTap={{ scale: 0.95 }} type='submit' className={submitButtonStyle} disabled={loading}>{loading ? 'Signing In...' : 'Login'}</motion.button>
            </div>
          </form>

          {/* Separator */}
          <motion.div variants={itemVariants} className={separatorStyle}> <div className={separatorLineStyle}></div> <span className={separatorTextStyle}>Or continue with</span></motion.div>
          {/* Google Button */}
          <motion.div variants={itemVariants} className='space-y-4'>
            <button type="button" onClick={() => triggerGoogleLogin()} className={socialButtonStyle}><FaGoogle className='text-lg' /> <span>Sign in with Google</span></button>
            {/* Microsoft button removed */}
          </motion.div>
          {/* Link to Register */}
          <motion.div variants={itemVariants} className={bottomTextStyle}><p className='text-gray-500 dark:text-gray-400'>Don't have an account?{' '} <Link to='/register' className={linkStyle}>Sign up</Link></p></motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;