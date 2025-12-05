import React, { useState, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';
import Lottie from 'lottie-react';
import registerAnimation from '@/assets/animations/Register.json';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserCheck, FiMapPin, FiPhone } from 'react-icons/fi';
import api from '@/api';
import Error from '../ui/Error';
import toast from 'react-hot-toast';
import ReCAPTCHA from "react-google-recaptcha";
import { AuthContext } from '@/context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

// --- Password Strength Indicator Component ---
const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = () => {
    let score = 0;
    if (!password) return score;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    return score;
  };
  const strength = getStrength();
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
  return (
    <div className="mt-1.5">
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${strength > 0 ? strengthColors[strength - 1] : 'bg-transparent'}`}
          style={{ width: `${(strength / 4) * 100}%`, transition: 'width 0.3s ease-in-out' }}
        ></div>
      </div>
      <p className={`text-xs mt-0.5 ${strength > 0 ? 'text-gray-600' : 'text-transparent'}`}>
        Strength: {strengthLabels[strength]}
      </p>
    </div>
  );
};

// --- Style Definitions ---
const pageStyle = 'min-h-screen flex items-center justify-center bg-gray-50 p-2 sm:p-4';
const containerStyle = 'w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] lg:max-h-[90vh]';
const leftPanelStyle = 'hidden lg:flex flex-col justify-center items-center p-6 xl:p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center';
const rightPanelStyle = 'p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[95vh] lg:max-h-[90vh]';
const titleStyle = 'text-2xl sm:text-3xl font-bold text-gray-900';
const subtitleStyle = 'text-gray-500 mt-1 text-sm sm:text-base';
const linkStyle = 'font-medium text-indigo-600 hover:text-indigo-500 ml-1';
const formStyle = 'space-y-2 sm:space-y-2.5';
const inputGroupStyle = 'relative mt-1';
const labelStyle = 'block text-xs sm:text-sm font-medium text-gray-700';
const iconStyle = 'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none';
const iconSvgStyle = 'h-4 w-4 sm:h-5 sm:w-5 text-gray-400';
const inputBaseStyle = 'block w-full pl-9 sm:pl-10 pr-3 py-1.5 sm:py-2 text-sm bg-gray-100 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500';
const inputErrorStyle = 'border-red-500';
const inputDefaultStyle = 'border-gray-300';
const passwordInputStyle = 'block w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-1.5 sm:py-2 text-sm bg-gray-100 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500';
const eyeButtonStyle = 'absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-indigo-500 transition-colors focus:outline-none';
const errorTextStyle = 'mt-0.5 text-xs text-red-600';
const submitButtonStyle = 'w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 mt-3';
const separatorStyle = 'relative flex items-center justify-center my-4';
const separatorLineStyle = 'w-full h-px bg-gray-300';
const separatorTextStyle = 'absolute px-3 bg-white text-xs sm:text-sm text-gray-500';
const socialButtonStyle = 'w-full flex items-center justify-center gap-2 sm:gap-3 py-2 px-4 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors';
const gridStyle = "grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3";

const RegisterPage = () => {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  const { setIsAuthenticated, get_username } = useContext(AuthContext);

  // --- State Variables ---
  const [firstName, setFirstName] = useState(''); const [lastName, setLastName] = useState(''); const [username, setUsername] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState(''); const [city, setCity] = useState(''); const [state, setState] = useState(''); const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Standard Registration Handler ---
  function handleStandardSubmit(e) {
    e.preventDefault(); // Prevent default form submission FIRST
    console.log("handleStandardSubmit triggered!"); // Confirm handler runs

    const recaptchaValue = recaptchaRef.current.getValue();
    if (!recaptchaValue) { toast.error("Please complete the reCAPTCHA."); return; }

    setLoading(true); setError(''); setValidationErrors({});
    if (password !== confirmPassword) { setValidationErrors({ confirm_password: ["Passwords do not match."] }); setLoading(false); return; }

    const registrationInfo = { first_name: firstName, last_name: lastName, username, email, password, confirm_password: confirmPassword, city, state, phone };
    const dataToSend = { ...registrationInfo, 'g-recaptcha-response': recaptchaValue };

    api.post('register/', dataToSend)
      .then((res) => { setLoading(false); recaptchaRef.current.reset(); if (res.data.access && res.data.refresh) { localStorage.setItem('access', res.data.access); localStorage.setItem('refresh', res.data.refresh); setIsAuthenticated(true); get_username(); toast.success('Registration successful! Welcome!'); navigate('/', { replace: true }); } else { setError('Auto-login failed.'); toast.error('Auto-login failed.'); } })
      .catch((err) => { setLoading(false); recaptchaRef.current.reset(); if (err.response && err.response.data) { if (err.response.data.recaptcha) { toast.error(err.response.data.recaptcha[0]); setError("CAPTCHA validation failed.") } else { setValidationErrors(err.response.data); setError('Please correct the errors below.'); } } else { setError(err.message || 'Registration failed.'); toast.error('Registration failed.'); } console.error("Reg error:", err.response ? err.response.data : err.message); });
  }

  // --- Google Login Handler ---
  const handleGoogleLoginSuccess = async (codeResponse) => {
    console.log("Google Login Success (Frontend - Code Flow):", codeResponse);
    try { const backendResponse = await api.post('google-login/', { code: codeResponse.code }); if (backendResponse.data.access && backendResponse.data.refresh) { localStorage.setItem('access', backendResponse.data.access); localStorage.setItem('refresh', backendResponse.data.refresh); setIsAuthenticated(true); get_username(); toast.success('Signed in with Google!'); navigate('/', { replace: true }); } else { throw new Error("Backend did not return JWT tokens."); } } catch (error) { const errorMsg = error.response?.data?.error || "Google sign-in failed on server."; toast.error(errorMsg); setError(errorMsg); console.error("Google backend login failed:", error.response ? error.response.data : error.message); }
  };
  const handleGoogleLoginError = (error) => { console.error("Google Login Failed (Frontend):", error); toast.error("Google sign-in initialization failed."); setError("Could not initiate Google sign-in."); };
  const triggerGoogleLogin = useGoogleLogin({ onSuccess: handleGoogleLoginSuccess, onError: handleGoogleLoginError, flow: 'auth-code' });

  // --- Animation Variants ---
  const cardVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

  // --- Helper Functions ---
  const getInputStyle = (fieldName) => `${inputBaseStyle} ${validationErrors[fieldName] ? inputErrorStyle : inputDefaultStyle}`;
  const getPasswordInputStyle = (fieldName) => `${passwordInputStyle} ${validationErrors[fieldName] ? inputErrorStyle : inputDefaultStyle}`;

  return (
    <div className={pageStyle}>
      <div className={containerStyle}>
        {/* Left Side */}
        <div className={leftPanelStyle}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}><Lottie animationData={registerAnimation} loop={true} className='w-48 h-48 xl:w-56 xl:h-56' /></motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}><h1 className='text-2xl xl:text-3xl font-extrabold tracking-wider mt-2 xl:mt-4'>Create Account</h1><p className='mt-2 xl:mt-3 text-sm xl:text-base text-indigo-200 max-w-xs mx-auto'>Join CartNova today and start discovering amazing products!</p></motion.div>
        </div>
        {/* Right Side */}
        <motion.div className={rightPanelStyle} variants={cardVariants} initial='hidden' animate='visible'>
          <motion.div variants={itemVariants} className='text-center mb-4 sm:mb-5'>{error && <Error error={error} />}<h2 className={titleStyle}>Sign Up</h2><p className={subtitleStyle}>Already have an account?{' '} <Link to='/login' className={linkStyle}>Sign in</Link></p></motion.div>
          <form onSubmit={handleStandardSubmit}>
            <div className={formStyle}>
              <div className={gridStyle}>
                <motion.div variants={itemVariants}><label htmlFor='firstName' className={labelStyle}>First Name <span className="text-red-500">*</span></label><div className={inputGroupStyle}><span className={iconStyle}><FiUserCheck className={iconSvgStyle} /></span><input type='text' id='firstName' value={firstName} onChange={(e) => setFirstName(e.target.value)} className={getInputStyle('first_name')} placeholder='Your first name' required /></div> {validationErrors.first_name && <p className={errorTextStyle}>{validationErrors.first_name[0]}</p>}</motion.div>
                <motion.div variants={itemVariants}><label htmlFor='lastName' className={labelStyle}>Last Name <span className="text-red-500">*</span></label><div className={inputGroupStyle}><span className={iconStyle}><FiUserCheck className={iconSvgStyle} /></span><input type='text' id='lastName' value={lastName} onChange={(e) => setLastName(e.target.value)} className={getInputStyle('last_name')} placeholder='Your last name' required /></div> {validationErrors.last_name && <p className={errorTextStyle}>{validationErrors.last_name[0]}</p>}</motion.div>
              </div>
              <motion.div variants={itemVariants}><label htmlFor='username' className={labelStyle}>Username <span className="text-red-500">*</span></label><div className={inputGroupStyle}><span className={iconStyle}><FiUser className={iconSvgStyle} /></span><input type='text' id='username' value={username} onChange={(e) => setUsername(e.target.value)} className={getInputStyle('username')} placeholder='Choose a username' required /></div> {validationErrors.username && <p className={errorTextStyle}>{validationErrors.username[0]}</p>}</motion.div>
              <motion.div variants={itemVariants}><label htmlFor='email' className={labelStyle}>Email Address <span className="text-red-500">*</span></label><div className={inputGroupStyle}><span className={iconStyle}><FiMail className={iconSvgStyle} /></span><input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} className={getInputStyle('email')} placeholder='Enter your email' required /></div> {validationErrors.email && <p className={errorTextStyle}>{validationErrors.email[0]}</p>}</motion.div>
              <motion.div variants={itemVariants}><label htmlFor='phone' className={labelStyle}>Phone Number (Optional)</label><div className={inputGroupStyle}><span className={iconStyle}><FiPhone className={iconSvgStyle} /></span><input type='tel' id='phone' value={phone} onChange={(e) => setPhone(e.target.value)} className={getInputStyle('phone')} placeholder='e.g., +919876543210' /></div> {validationErrors.phone && <p className={errorTextStyle}>{validationErrors.phone[0]}</p>}</motion.div>
              <div className={gridStyle}>
                   <motion.div variants={itemVariants}><label htmlFor='city' className={labelStyle}>City (Optional)</label><div className={inputGroupStyle}><span className={iconStyle}><FiMapPin className={iconSvgStyle} /></span><input type='text' id='city' value={city} onChange={(e) => setCity(e.target.value)} className={getInputStyle('city')} placeholder='Your city' /></div> {validationErrors.city && <p className={errorTextStyle}>{validationErrors.city[0]}</p>}</motion.div>
                   <motion.div variants={itemVariants}><label htmlFor='state' className={labelStyle}>Country (Optional)</label><div className={inputGroupStyle}><span className={iconStyle}><FiMapPin className={iconSvgStyle} /></span><input type='text' id='state' value={state} onChange={(e) => setState(e.target.value)} className={getInputStyle('state')} placeholder='Your country' /></div> {validationErrors.state && <p className={errorTextStyle}>{validationErrors.state[0]}</p>}</motion.div>
              </div>
              <motion.div variants={itemVariants}><label htmlFor='password'className={labelStyle}>Password <span className="text-red-500">*</span></label><div className={inputGroupStyle}><span className={iconStyle}><FiLock className={iconSvgStyle} /></span><input type={showPassword ? 'text' : 'password'} id='password' value={password} onChange={(e) => setPassword(e.target.value)} className={getPasswordInputStyle('password')} placeholder='Enter your password' required /><button type='button' onClick={() => setShowPassword(!showPassword)} className={eyeButtonStyle}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></div><PasswordStrengthIndicator password={password} />{validationErrors.password && !Array.isArray(validationErrors.password) && <p className={errorTextStyle}>{validationErrors.password}</p>} {validationErrors.password && Array.isArray(validationErrors.password) && <p className={errorTextStyle}>{validationErrors.password.join(' ')}</p>}</motion.div>
              <motion.div variants={itemVariants}><label htmlFor='confirmPassword'className={labelStyle}>Confirm Password <span className="text-red-500">*</span></label><div className={inputGroupStyle}><span className={iconStyle}><FiLock className={iconSvgStyle} /></span><input type={showConfirmPassword ? 'text' : 'password'} id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={getPasswordInputStyle('confirm_password')} placeholder='Confirm your password' required /><button type='button' onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={eyeButtonStyle}>{showConfirmPassword ? <FiEyeOff /> : <FiEye />}</button></div> {validationErrors.confirm_password && <p className={errorTextStyle}>{validationErrors.confirm_password[0]}</p>}</motion.div>
              <motion.div variants={itemVariants} className="flex justify-center pt-1 scale-90 sm:scale-100 origin-center"><ReCAPTCHA ref={recaptchaRef} sitekey="6LdRFfkrAAAAAMGgrtj7nlPy_ZFri__G0dCKbXWZ" /></motion.div>
              <motion.button variants={itemVariants} whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(79, 70, 229, 0.4)' }} whileTap={{ scale: 0.95 }} type='submit' className={submitButtonStyle} disabled={loading}>{loading ? 'Creating Account...' : 'Sign Up'}</motion.button>
            </div>
          </form>
          <motion.div variants={itemVariants} className={separatorStyle}><div className={separatorLineStyle}></div><span className={separatorTextStyle}>Or sign up with</span></motion.div>
          <motion.div variants={itemVariants} className='space-y-2 sm:space-y-3'><button type="button" onClick={() => triggerGoogleLogin()} className={socialButtonStyle}><FaGoogle className='text-base sm:text-lg' /> <span>Sign up with Google</span></button></motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;