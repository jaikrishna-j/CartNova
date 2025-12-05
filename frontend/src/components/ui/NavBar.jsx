import { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { Link, useSearchParams, useNavigate, NavLink } from 'react-router-dom';
import { FaCartShopping, FaRegUser } from 'react-icons/fa6';
import { IoSearch } from 'react-icons/io5';
import { FiUser } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/apiProducts';
import { HiOutlineBars3, HiChevronDown } from 'react-icons/hi2';
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
      <nav className={`bg-white shadow-lg fixed top-0 left-0 w-full z-50 transition-colors duration-300`}>
        <div className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-2'>
          <div
            className={`flex justify-between items-center ${NAVBAR_INNER_HEIGHT_CLASS} w-full`}
          >
            {/* 1. LEFT: Logo */}
            <Link
              to='/'
              className='flex-shrink-0 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 uppercase no-underline tracking-wider hover:from-indigo-700 hover:to-purple-700 transition-all duration-300'
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
                  <div className='absolute top-full mt-2 left-0 lg:left-auto lg:w-56 w-full min-w-0 max-w-[min(100vw-2rem,100%)] lg:max-w-56 bg-white lg:bg-transparent rounded-xl shadow-2xl lg:shadow-none border border-gray-200 lg:border-transparent py-1 max-h-[calc(100vh-12rem)] overflow-y-auto z-50'>
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
                              ? 'bg-indigo-100 text-indigo-700 font-bold'
                              : 'text-gray-700 hover:bg-indigo-50'
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
                className='flex w-[50%] items-stretch shadow-md overflow-hidden rounded-xl border border-gray-200'
              >
                <input
                  type='text'
                  placeholder='Search products...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='flex-grow bg-white px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none text-sm border-none ring-0 focus:ring-0'
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
                      <div className='relative w-5 h-5 flex items-center justify-center'>
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
                      {`Hi, ${username}`}
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
                {numCartItems > 0 && (
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

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <div className='flex flex-col items-center space-y-4 py-6 bg-white border-t border-gray-200 px-4'>
            <form
              onSubmit={handleSearchSubmit}
              className='flex flex-col w-full max-w-md space-y-2'
            >
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='bg-gray-100 border border-gray-300 text-gray-700 text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full'
              >
                {allCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className='flex bg-gray-100 rounded-lg overflow-hidden border border-gray-300'>
                <input
                  type='text'
                  placeholder='Search products...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='flex-grow bg-transparent px-3 py-2 text-gray-800 placeholder-gray-500 focus:outline-none text-sm border-none'
                />
                <button
                  type='submit'
                  className='bg-indigo-600 text-white px-3 hover:bg-indigo-700 transition duration-200 border-none'
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
                  className='flex items-center gap-2 font-medium text-gray-900 no-underline hover:text-indigo-600 transition-colors duration-200'
                >
                  <div className='relative w-5 h-5 flex items-center justify-center'>
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
                  {`Hi, ${username}`}
                </NavLink>
                <NavLink
                  to='/'
                  onClick={() => { logout(); setIsOpen(false); }}
                  className='font-medium no-underline text-gray-900 hover:text-indigo-600 transition-colors duration-200'
                >
                  Logout
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to='/login'
                  onClick={() => setIsOpen(false)}
                  className='font-medium no-underline text-gray-900 hover:text-indigo-600 transition-colors duration-200'
                >
                  Sign in
                </NavLink>
                <NavLink
                  to='/register'
                  onClick={() => setIsOpen(false)}
                  className='font-medium no-underline text-gray-900 hover:text-indigo-600 transition-colors duration-200'
                >
                  Register
                </NavLink>
              </>
            )}
            <Link
              to='/cart'
              onClick={() => setIsOpen(false)}
              className='flex items-center gap-2 no-underline font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-200'
            >
              <FaCartShopping />
              <span>
                Cart {numCartItems > 0 && <span className='font-bold'>({numCartItems})</span>}
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* SPACER DIV */}
      <div className='invisible h-16 lg:h-20'></div>
    </>
  );
};

export default NavBar;