import { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { Link, useSearchParams, useNavigate, NavLink } from 'react-router-dom';
import { FaCartShopping, FaRegUser } from 'react-icons/fa6';
import { IoSearch } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/apiProducts';
import { HiOutlineBars3, HiChevronDown } from 'react-icons/hi2';
import { HiMoon, HiSun } from 'react-icons/hi2';
import { AuthContext } from '@/context/AuthContext';

const NavBar = ({ numCartItems }) => {
  const { isAuthenticated, setIsAuthenticated, username } = useContext(AuthContext);

  function logout(){
    localStorage.removeItem("access")
    setIsAuthenticated(false)
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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

  const allCategories = useMemo(() => {
    const list = [{ value: 'all', label: 'All Category' }];
    if (Array.isArray(categories) && categories.length > 0) {
      list.push(...categories.filter((cat) => cat.value !== 'all'));
    }
    return list;
  }, [categories]);

  // Dark mode effect - Update theme when isDarkMode changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Initialize theme on mount to sync with localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    if (shouldBeDark !== isDarkMode) {
      setIsDarkMode(shouldBeDark);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

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

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (searchQuery.trim()) {
      newParams.set('q', searchQuery.trim());
    }
    if (selectedCategory !== 'all') {
      newParams.set('category', selectedCategory);
    }
    newParams.set('page', '1');
    navigate(`/store?${newParams.toString()}`);
  };

  const handleCategorySelect = (categoryValue) => {
    setSelectedCategory(categoryValue);
    const newParams = new URLSearchParams();
    if (searchQuery.trim()) {
      newParams.set('q', searchQuery.trim());
    }
    if (categoryValue !== 'all') {
      newParams.set('category', categoryValue);
    }
    newParams.set('page', '1');
    navigate(`/store?${newParams.toString()}`);
    setIsCategoryMenuOpen(false);
  };

  const NAVBAR_INNER_HEIGHT_CLASS = 'h-16';
  const currentCategoryLabel =
    allCategories.find((c) => c.value === selectedCategory)?.label ||
    'All Category';

  return (
    <>
      {/* 1. FIXED NAVBAR */}
      <nav className={`bg-white dark:bg-gray-900 shadow-lg fixed top-0 left-0 w-full z-50 transition-colors duration-300`}>
        <div className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-2'>
          <div
            className={`flex justify-between items-center ${NAVBAR_INNER_HEIGHT_CLASS} w-full`}
          >
            {/* 1. LEFT: Logo */}
            <Link
              to='/'
              className='flex-shrink-0 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 uppercase no-underline tracking-wider hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-300 dark:hover:to-purple-300 transition-all duration-300'
            >
              CartNova
            </Link>

            {/* 2. CENTER: Search UI (Desktop Only) */}
            <div className='hidden lg:flex flex-grow justify-center items-stretch mx-8 max-w-4xl space-x-2'>
              <div ref={categoryButtonRef} className='relative flex-shrink-0 z-30'>
                <button
                  onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
                  className='bg-indigo-600 dark:bg-indigo-700 text-white text-sm font-medium pl-3 pr-4 py-2 rounded-xl border border-indigo-700 dark:border-indigo-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 flex items-center justify-center space-x-1 hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md hover:shadow-lg'
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
                  <div className='absolute top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1 max-h-80 overflow-y-auto z-50'>
                    {categoriesPending ? (
                      <div className='text-center py-2 text-sm text-gray-500'>
                        Loading...
                      </div>
                    ) : (
                      allCategories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => handleCategorySelect(cat.value)}
                          className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                            selectedCategory === cat.value
                              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700'
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
                className='flex-shrink-0 text-indigo-600 dark:text-indigo-400 border border-indigo-400 dark:border-indigo-500 text-sm font-medium px-4 py-2 rounded-xl shadow-md flex items-center justify-center no-underline bg-white dark:bg-gray-800 hover:!bg-indigo-600 dark:hover:!bg-indigo-700 hover:!text-white hover:!border-indigo-600 dark:hover:!border-indigo-600 transition-all duration-300'
              >
                Store
              </Link>
              <form
                onSubmit={handleSearchSubmit}
                className='flex w-[50%] items-stretch shadow-md overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700'
              >
                <input
                  type='text'
                  placeholder='Search products...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='flex-grow bg-white dark:bg-gray-800 px-4 py-2 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-sm border-none ring-0 focus:ring-0'
                />
                <button
                  type='submit'
                  className='bg-indigo-600 dark:bg-indigo-700 text-white w-12 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-200 focus:outline-none flex items-center justify-center border-none rounded-r-xl'
                >
                  <IoSearch className='text-xl' />
                </button>
              </form>
            </div>

            {/* 3. RIGHT: Auth Links & Cart Icon */}
            <div className='flex items-center space-x-4 sm:space-x-6'>
              {/* Dark Mode Toggle Button */}
              <button
                onClick={toggleDarkMode}
                className='p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transform hover:scale-110 shadow-md hover:shadow-lg'
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <HiSun className='text-xl text-yellow-500' />
                ) : (
                  <HiMoon className='text-xl text-indigo-600' />
                )}
              </button>
              
              <div className='hidden lg:flex space-x-6 items-center'>
                {isAuthenticated ? (
                  <>
                    <NavLink
                      to='/profile'
                      className='flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 no-underline transition-colors duration-200'
                      end
                    >
                      <FaRegUser className='text-xl' />
                      {`Hi, ${username}`}
                    </NavLink>
                    <NavLink
                      onClick={logout}
                      to='/'
                      className='font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 no-underline transition-colors duration-200'
                      end
                    >
                      Logout
                    </NavLink>
                  </>
                ) : (
                  <div>
                    <p className='text-xs text-gray-500 dark:text-gray-400 text-right -mb-1'>
                      Welcome guest!
                    </p>
                    <div className='flex items-center space-x-2'>
                      <FaRegUser className='text-xl text-gray-600 dark:text-gray-400' />
                      <div className='text-sm'>
                        <NavLink
                          to='/login'
                          className='font-medium text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 no-underline transition-colors duration-200'
                        >
                          Sign in
                        </NavLink>
                        <span className='mx-1 text-gray-400 dark:text-gray-500'>|</span>
                        <NavLink
                          to='/register'
                          className='font-medium text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 no-underline transition-colors duration-200'
                        >
                          Register
                        </NavLink>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link to='/cart' className='relative hidden lg:inline-block'>
                <div className='bg-indigo-600 dark:bg-indigo-700 rounded-full p-3 flex items-center justify-center hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105'>
                  <FaCartShopping className='text-white text-xl' />
                </div>
                {numCartItems > 0 && (
                  <span className='absolute -top-1 -right-3 bg-red-500 dark:bg-red-600 text-white text-xs font-bold px-[8px] py-1 flex items-center justify-center rounded-full shadow-lg animate-pulse'>
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
                  className={`block w-6 h-0.5 bg-gray-900 dark:bg-gray-100 transform transition duration-300 ease-in-out ${
                    isOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-gray-900 dark:bg-gray-100 my-1 transition duration-300 ease-in-out ${
                    isOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-gray-900 dark:bg-gray-100 transform transition duration-300 ease-in-out ${
                    isOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <div className='flex flex-col items-center space-y-4 py-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4'>
            <form
              onSubmit={handleSearchSubmit}
              className='flex flex-col w-full max-w-md space-y-2'
            >
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 w-full'
              >
                {allCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className='flex bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600'>
                <input
                  type='text'
                  placeholder='Search products...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='flex-grow bg-transparent px-3 py-2 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-sm border-none'
                />
                <button
                  type='submit'
                  className='bg-indigo-600 dark:bg-indigo-700 text-white px-3 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-200 border-none'
                >
                  <IoSearch />
                </button>
              </div>
            </form>
            {isAuthenticated ? (
              <>
                <NavLink
                  to='/profile'
                  onClick={() => setIsOpen(false)}
                  className='font-medium text-gray-900 dark:text-gray-100 no-underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200'
                >
                  {`Hi, ${username}`}
                </NavLink>
                <NavLink
                  to='/'
                  onClick={() => { logout(); setIsOpen(false); }}
                  className='font-medium no-underline text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200'
                >
                  Logout
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to='/login'
                  onClick={() => setIsOpen(false)}
                  className='font-medium no-underline text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200'
                >
                  Sign in
                </NavLink>
                <NavLink
                  to='/register'
                  onClick={() => setIsOpen(false)}
                  className='font-medium no-underline text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200'
                >
                  Register
                </NavLink>
              </>
            )}
            <Link
              to='/cart'
              onClick={() => setIsOpen(false)}
              className='flex items-center gap-2 no-underline font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200'
            >
              <FaCartShopping />
              <span>
                Cart {numCartItems > 0 && <span className='font-bold'>({numCartItems})</span>}
              </span>
            </Link>
            
            {/* Dark Mode Toggle Button (Mobile) */}
            <button
              onClick={() => {
                toggleDarkMode();
                setIsOpen(false);
              }}
              className='p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-md hover:shadow-lg'
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <HiSun className='text-xl text-yellow-500' />
              ) : (
                <HiMoon className='text-xl text-indigo-600' />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* SPACER DIV */}
      <div className='invisible h-16 lg:h-20'></div>
    </>
  );
};

export default NavBar;