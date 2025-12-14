import { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { Link, useSearchParams, useNavigate, NavLink } from 'react-router-dom';
import { FaCartShopping, FaRegUser } from 'react-icons/fa6';
import { IoSearch } from 'react-icons/io5';
import { FiUser, FiX } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/apiProducts';
import { HiOutlineBars3, HiChevronDown, HiHome } from 'react-icons/hi2';
import { AuthContext } from '@/context/AuthContext';
import api from '@/api';
import { BASE_URL } from '@/api';

const NavBar = ({ numCartItems }) => {
  const { isAuthenticated, setIsAuthenticated, username } = useContext(AuthContext);

  function logout(){
    localStorage.removeItem("access")
    setIsAuthenticated(false)
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Add/remove class to body when menu is open to hide checkout content
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isOpen]);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );

  const categoryButtonRef = useRef(null);

  const { data: categories = [], isPending: categoriesPending } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Fetch user info to get profile image
  const { data: userInfo } = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      const response = await api.get('user_info');
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get profile image URL
  const getProfileImageUrl = () => {
    if (userInfo?.profile_image) {
      try {
        if (userInfo.profile_image.startsWith('http')) {
          return userInfo.profile_image;
        }
        const imageUrl = new URL(userInfo.profile_image, BASE_URL);
        return imageUrl.href;
      } catch (e) {
        console.error("Error creating profile image URL:", e);
        return null;
      }
    }
    return null;
  };

  const profileImageUrl = getProfileImageUrl();

  const allCategories = useMemo(() => {
    const list = [{ value: 'all', label: 'All Category' }];
    if (Array.isArray(categories) && categories.length > 0) {
      list.push(...categories.filter((cat) => cat.value !== 'all'));
    }
    return list;
  }, [categories]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryButtonRef.current &&
        !categoryButtonRef.current.contains(event.target)
      ) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [categoryButtonRef]);

  // Search only updates when user submits (Enter key or search button click)
  // No auto-update while typing to improve performance

  // Sync search query with URL params when URL changes externally
  // Only sync if we're actually on a page that uses search (store page)
  useEffect(() => {
    const currentPath = window.location.pathname;
    const urlQuery = searchParams.get('q') || '';
    
    // Only sync search query if we're on store page or if URL has a query
    // This prevents clearing search when navigating to home page
    if (currentPath === '/store' || urlQuery) {
      if (urlQuery !== searchQuery) {
        setSearchQuery(urlQuery);
      }
    } else if (currentPath === '/' && searchQuery) {
      // Clear search query when navigating to home page (if it exists)
      setSearchQuery('');
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate to store page with search query when user submits (Enter key or button click)
    const newParams = new URLSearchParams();
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery) {
      newParams.set('q', trimmedQuery);
      // When searching, ignore category - search across all products
    } else {
      // When search is empty, restore category filter
      if (selectedCategory !== 'all') {
        newParams.set('category', selectedCategory);
      }
    }
    newParams.set('page', '1');
    navigate(`/store?${newParams.toString()}`);
  };

  const handleCategorySelect = (categoryValue) => {
    setSelectedCategory(categoryValue);
    const newParams = new URLSearchParams();
    
    // If there's a search query, ignore category change (search takes priority)
    if (searchQuery.trim()) {
      newParams.set('q', searchQuery.trim());
      // Don't add category when searching
    } else {
      // Only apply category when not searching
      if (categoryValue !== 'all') {
        newParams.set('category', categoryValue);
      }
    }
    newParams.set('page', '1');
    navigate(`/store?${newParams.toString()}`);
    setIsCategoryMenuOpen(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Search only updates on form submit (Enter key or search button click)
  };

  const NAVBAR_INNER_HEIGHT_CLASS = 'h-16';
  const currentCategoryLabel =
    allCategories.find((c) => c.value === selectedCategory)?.label ||
    'All Category';

  return (
    <>
      {/* 1. FIXED NAVBAR */}
      <nav className={`bg-white shadow-lg fixed top-0 left-0 w-full z-50 transition-colors duration-300`}>
        <div className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-2'>
          <div
            className={`flex justify-between items-center ${NAVBAR_INNER_HEIGHT_CLASS} w-full`}
          >
            {/* 1. LEFT: Logo */}
            <Link
              to='/'
              className='flex-shrink-0 text-lg sm:text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 uppercase no-underline tracking-wider hover:from-indigo-700 hover:to-purple-700 transition-all duration-300'
            >
              CartNova
            </Link>

            {/* 2. CENTER: Search UI (Desktop Only) */}
            <div className='hidden lg:flex flex-grow justify-center items-stretch mx-8 max-w-4xl space-x-2'>
              <div ref={categoryButtonRef} className='relative flex-shrink-0 z-30'>
                <button
                  onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
                  className='bg-indigo-600 text-white text-sm font-medium pl-3 pr-4 py-2 rounded-xl border-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center justify-center space-x-1 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                >
                  <HiOutlineBars3 className='text-lg' />
                  <span>{currentCategoryLabel}</span>
                  <HiChevronDown
                    className={`ml-1 transition-transform duration-300 ${
                      isCategoryMenuOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
                {isCategoryMenuOpen && (
                  <div className='absolute top-full mt-2 left-0 lg:left-auto lg:w-56 w-full min-w-0 max-w-[min(100vw-2rem,100%)] lg:max-w-56 bg-white rounded-xl shadow-2xl border-2 border-gray-200 py-2 max-h-[calc(100vh-12rem)] overflow-y-auto z-50'>
                    {categoriesPending ? (
                      <div className='text-center py-2 text-sm text-gray-500'>
                        Loading...
                      </div>
                    ) : (
                      allCategories.map((cat, index) => (
                        <button
                          key={cat.value}
                          onClick={() => handleCategorySelect(cat.value)}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                            selectedCategory === cat.value
                              ? 'bg-indigo-100 text-indigo-700 font-bold'
                              : 'text-gray-700 hover:bg-indigo-50'
                          } ${index === 0 ? 'rounded-t-lg' : ''} ${
                            index === allCategories.length - 1 ? 'rounded-b-lg' : ''
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              <Link
                to='/store'
                className='flex-shrink-0 text-indigo-600 border-none text-sm font-medium px-4 py-2 rounded-xl shadow-md flex items-center justify-center no-underline bg-white hover:!bg-indigo-600 hover:!text-white transition-all duration-300'
              >
                Store
              </Link>
              <form
                onSubmit={handleSearchSubmit}
                className='flex w-[50%] items-stretch shadow-md overflow-hidden rounded-xl border-2 border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 transition-all duration-200'
              >
                <input
                  type='text'
                  placeholder='Search products...'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className='flex-grow bg-white px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none text-sm border-none ring-0 focus:ring-0 rounded-l-xl'
                />
                <button
                  type='submit'
                  className='bg-indigo-600 text-white w-12 hover:bg-indigo-700 transition duration-200 focus:outline-none flex items-center justify-center border-none rounded-r-xl'
                >
                  <IoSearch className='text-xl' />
                </button>
              </form>
            </div>

            {/* 3. RIGHT: Auth Links & Cart Icon */}
            <div className='flex items-center space-x-4 sm:space-x-6'>
              <div className='hidden lg:flex space-x-6 items-center'>
                {isAuthenticated ? (
                  <>
                    <NavLink
                      to='/profile'
                      className='flex items-center gap-2 font-medium text-gray-700 hover:text-indigo-600 no-underline transition-colors duration-200'
                      end
                    >
                      <div className='relative w-5 h-5 flex items-center justify-center flex-shrink-0'>
                        {profileImageUrl ? (
                          <img
                            src={profileImageUrl}
                            alt='Profile'
                            className='w-5 h-5 rounded-full object-cover border border-gray-300'
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const iconElement = e.target.nextElementSibling;
                              if (iconElement) {
                                iconElement.classList.remove('hidden');
                                iconElement.classList.add('block');
                              }
                            }}
                          />
                        ) : null}
                        <FiUser className={`text-lg ${profileImageUrl ? 'hidden' : 'block'}`} />
                      </div>
                      <span>{`Hi, ${username}`}</span>
                    </NavLink>
                    <NavLink
                      onClick={logout}
                      to='/'
                      className='font-medium text-gray-700 hover:text-indigo-600 no-underline transition-colors duration-200'
                      end
                    >
                      Logout
                    </NavLink>
                  </>
                ) : (
                  <div>
                    <p className='text-xs text-gray-500 text-right -mb-1'>
                      Welcome guest!
                    </p>
                    <div className='flex items-center space-x-2'>
                      <FaRegUser className='text-xl text-gray-600' />
                      <div className='text-sm'>
                        <NavLink
                          to='/login'
                          className='font-medium text-gray-800 hover:text-indigo-600 no-underline transition-colors duration-200'
                        >
                          Sign in
                        </NavLink>
                        <span className='mx-1 text-gray-400'>|</span>
                        <NavLink
                          to='/register'
                          className='font-medium text-gray-800 hover:text-indigo-600 no-underline transition-colors duration-200'
                        >
                          Register
                        </NavLink>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link to='/cart' className='relative hidden lg:inline-block'>
                <div className='bg-indigo-600 rounded-full p-3 flex items-center justify-center hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border-none'>
                  <FaCartShopping className='text-white text-xl' />
                </div>
                {isAuthenticated && numCartItems > 0 && (
                  <span className='absolute -top-1 -right-3 bg-red-500 text-white text-xs font-bold px-[8px] py-1 flex items-center justify-center rounded-full shadow-lg animate-pulse'>
                    {numCartItems}
                  </span>
                )}
              </Link>

              {/* Mobile Toggle Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className='lg:hidden appearance-none bg-transparent border-none p-0 m-0 focus:outline-none flex flex-col justify-center items-center w-8 h-8'
                aria-label='Toggle menu'
              >
                <span
                  className={`block w-6 h-0.5 bg-gray-900 transform transition duration-300 ease-in-out ${
                    isOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-gray-900 my-1 transition duration-300 ease-in-out ${
                    isOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-gray-900 transform transition duration-300 ease-in-out ${
                    isOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay with Blur */}
        {isOpen && (
          <div
            className='fixed inset-0 bg-black/40 backdrop-blur-sm z-[999998] lg:hidden'
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed inset-0 z-[999999] flex items-center justify-center transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsOpen(false)}
        >
          <div 
            className='bg-white border border-gray-200 shadow-2xl rounded-2xl mx-4 w-full max-w-md overflow-hidden relative z-[999999] isolate'
            onClick={(e) => e.stopPropagation()}
            style={{ 
              isolation: 'isolate',
              contain: 'layout style paint',
              position: 'relative',
              zIndex: 999999
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className='absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 z-10 border-none outline-none'
              aria-label='Close menu'
            >
              <FiX className='text-gray-600 text-lg' />
            </button>
            
            <div className='flex flex-col space-y-3 py-4 px-3'>
              {/* Search and Category Section */}
              <div className='space-y-2'>
                <h3 className='text-xs font-semibold text-gray-700 uppercase tracking-wide px-1'>
                  Search & Browse
                </h3>
                <form
                  onSubmit={handleSearchSubmit}
                  className='flex flex-col w-full space-y-2'
                >
                  <div className='relative'>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategorySelect(e.target.value)}
                      className='w-full bg-white border-2 border-gray-200 text-gray-700 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer transition-all duration-200 hover:border-indigo-300'
                    >
                      {allCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <HiChevronDown className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-sm' />
                  </div>
                  <div className='flex bg-white rounded-lg overflow-hidden border-2 border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 transition-all duration-200'>
                    <input
                      type='text'
                      placeholder='Search products...'
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className='w-[80%] bg-transparent px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none text-xs border-none'
                    />
                    <button
                      type='submit'
                      className='w-[20%] bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200 border-none flex items-center justify-center rounded-r-lg'
                    >
                      <IoSearch className='text-base' />
                    </button>
                  </div>
                </form>
              </div>

              {/* Divider */}
              <div className='border-t border-gray-200 my-1'></div>

              {/* Navigation Links Section */}
              <div className='space-y-2'>
                <h3 className='text-xs font-semibold text-gray-700 uppercase tracking-wide px-1'>
                  Navigation
                </h3>
                <div className='space-y-1.5'>
                  {/* User/Auth Links First */}
                  {isAuthenticated ? (
                    <>
                      <NavLink
                        to='/profile'
                        onClick={() => setIsOpen(false)}
                        className='flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 no-underline transition-all duration-200 group text-sm'
                      >
                        <div className='w-6 h-6 rounded-md flex items-center justify-center overflow-hidden bg-gray-100 group-hover:bg-indigo-600 transition-colors duration-200 flex-shrink-0'>
                          {profileImageUrl ? (
                            <img
                              src={profileImageUrl}
                              alt='Profile'
                              className='w-full h-full object-cover'
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const iconElement = e.target.nextElementSibling;
                                if (iconElement) {
                                  iconElement.classList.remove('hidden');
                                  iconElement.classList.add('block');
                                }
                              }}
                            />
                          ) : null}
                          <FiUser className={`text-sm text-gray-600 group-hover:text-white transition-colors duration-200 ${profileImageUrl ? 'hidden' : 'block'}`} />
                        </div>
                        <span className='flex-shrink-0'>{`Hi, ${username}`}</span>
                      </NavLink>
                      <NavLink
                        to='/'
                        onClick={() => { logout(); setIsOpen(false); }}
                        className='flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 no-underline transition-all duration-200 group text-sm'
                      >
                        <div className='w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center group-hover:bg-red-600 transition-colors duration-200'>
                          <FiUser className='text-sm text-gray-600 group-hover:text-white transition-colors duration-200' />
                        </div>
                        <span>Logout</span>
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to='/login'
                        onClick={() => setIsOpen(false)}
                        className='flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 no-underline transition-all duration-200 group text-sm'
                      >
                        <div className='w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-200'>
                          <FiUser className='text-sm text-gray-600 group-hover:text-white transition-colors duration-200' />
                        </div>
                        <span>Sign in</span>
                      </NavLink>
                      <NavLink
                        to='/register'
                        onClick={() => setIsOpen(false)}
                        className='flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 no-underline transition-all duration-200 group text-sm'
                      >
                        <div className='w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-200'>
                          <FiUser className='text-sm text-gray-600 group-hover:text-white transition-colors duration-200' />
                        </div>
                        <span>Register</span>
                      </NavLink>
                    </>
                  )}
                  
                  {/* Divider between auth and navigation */}
                  <div className='border-t border-gray-200 my-1'></div>
                  
                  {/* Navigation Links */}
                  <Link
                    to='/'
                    onClick={() => setIsOpen(false)}
                    className='flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 no-underline transition-all duration-200 group text-sm'
                  >
                    <div className='w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-200'>
                      <HiHome className='text-indigo-600 group-hover:text-white transition-colors duration-200 text-sm' />
                    </div>
                    <span>Home</span>
                  </Link>
                  <Link
                    to='/store'
                    onClick={() => setIsOpen(false)}
                    className='flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 no-underline transition-all duration-200 group text-sm'
                  >
                    <div className='w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-200'>
                      <HiOutlineBars3 className='text-indigo-600 group-hover:text-white transition-colors duration-200 text-sm' />
                    </div>
                    <span>Store</span>
                  </Link>
                  <Link
                    to='/cart'
                    onClick={() => setIsOpen(false)}
                    className='flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 no-underline transition-all duration-200 group relative text-sm'
                  >
                    <div className='relative w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-200'>
                      <FaCartShopping className='text-sm text-gray-600 group-hover:text-white transition-colors duration-200' />
                      {isAuthenticated && numCartItems > 0 && (
                        <span className='absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse shadow-lg border-2 border-white'>
                          {numCartItems > 9 ? '9+' : numCartItems}
                        </span>
                      )}
                    </div>
                    <span>Cart</span>
                    {isAuthenticated && numCartItems > 0 && (
                      <span className='ml-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce'>
                        {numCartItems} {numCartItems === 1 ? 'item' : 'items'}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* SPACER DIV */}
      <div className='invisible h-16 lg:h-20'></div>
    </>
  );
};

export default NavBar;