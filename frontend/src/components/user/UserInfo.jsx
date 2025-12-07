import { FiEdit, FiUser } from 'react-icons/fi';
import { BASE_URL } from '@/api';

const UserInfo = ({userInfo, onEditClick}) => {
  // Get profile image URL
  const getProfileImageUrl = () => {
    if (userInfo?.profile_image) {
      try {
        // If it's already a full URL, return as is
        if (userInfo.profile_image.startsWith('http')) {
          return userInfo.profile_image;
        }
        // Otherwise, construct the full URL using URL constructor (consistent with other components)
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

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-start'>
      {/* Profile Card */}
      <div className='lg:col-span-1 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-center flex flex-col items-center'>
        <div className='w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full mb-3 sm:mb-4 ring-2 sm:ring-4 ring-indigo-200 overflow-hidden bg-gray-100 flex items-center justify-center'>
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt='User Profile'
              className='w-full h-full object-cover'
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center ${profileImageUrl ? 'hidden' : ''}`}>
            <FiUser className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-400' />
          </div>
        </div>
        <h4 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-900'>
          {`${userInfo.first_name} ${userInfo.last_name}`}
        </h4>
        <p className='text-xs sm:text-sm md:text-base text-gray-500 mt-1'>{userInfo.email}</p>
        <button 
          onClick={onEditClick}
          className='mt-3 sm:mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white text-xs sm:text-sm font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border-none'
        >
          <FiEdit className="text-sm sm:text-base" />
          Edit Profile
        </button>
      </div>

      {/* Account Overview Card */}
      <div className='lg:col-span-3 bg-white rounded-xl sm:rounded-2xl shadow-lg'>
        <div className='bg-indigo-600 text-white p-2.5 sm:p-3 rounded-t-xl sm:rounded-t-2xl'>
          <h5 className='text-base sm:text-lg md:text-xl font-bold'>Account Overview</h5>
        </div>
        <div className='p-4 sm:p-5 lg:p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-3 sm:gap-y-4 text-sm sm:text-base text-gray-700'>
            <p>
              <strong className='font-semibold text-gray-800'>Full Name:</strong> {`${userInfo.first_name} ${userInfo.last_name}`}
            </p>
            <p>
              <strong className='font-semibold text-gray-800'>Username:</strong> {userInfo.username}
            </p>
            <p>
              <strong className='font-semibold text-gray-800'>City:</strong> {userInfo.city || 'N/A'}
            </p>
            <p>
              <strong className='font-semibold text-gray-800'>Email:</strong> {userInfo.email}
            </p>
            <p>
              <strong className='font-semibold text-gray-800'>State/Country:</strong> {userInfo.state || 'N/A'}
            </p>
            <p>
              <strong className='font-semibold text-gray-800'>Phone:</strong> {userInfo.phone || 'N/A'}
            </p>
          </div>
        </div>
      </div>
      
      {/* "Recent Items" section has been completely removed. */}

    </div>
  );
};

export default UserInfo;