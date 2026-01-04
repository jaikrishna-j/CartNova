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
    <div className='grid items-start grid-cols-1 gap-4 lg:grid-cols-4 sm:gap-6 lg:gap-8'>
      {/* Profile Card */}
      <div className='flex flex-col items-center p-4 text-center bg-white shadow-lg lg:col-span-1 rounded-xl sm:rounded-2xl sm:p-6'>
        <div className='flex items-center justify-center w-20 h-20 mb-3 overflow-hidden bg-gray-100 rounded-full sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 sm:mb-4 ring-2 sm:ring-4 ring-indigo-200'>
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt='User Profile'
              className='object-cover w-full h-full'
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center ${profileImageUrl ? 'hidden' : ''}`}>
            <FiUser className='text-2xl text-gray-400 sm:text-3xl md:text-4xl lg:text-5xl' />
          </div>
        </div>
        <h4 className='text-lg font-bold text-gray-900 sm:text-xl md:text-2xl'>
          {`${userInfo.first_name} ${userInfo.last_name}`}
        </h4>
        <p className='mt-1 text-xs text-gray-500 sm:text-sm md:text-base'>{userInfo.email}</p>
        <button 
          onClick={onEditClick}
          className='mt-3 sm:mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white text-xs sm:text-sm font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border-none'
        >
          <FiEdit className="text-sm sm:text-base" />
          Edit Profile
        </button>
      </div>

      {/* Account Overview Card */}
      <div className='bg-white shadow-lg lg:col-span-3 rounded-xl sm:rounded-2xl'>
        <div className='bg-indigo-600 text-white p-2.5 sm:p-3 rounded-t-xl sm:rounded-t-2xl'>
          <h5 className='text-base font-bold sm:text-lg md:text-xl'>Account Overview</h5>
        </div>
        <div className='p-4 sm:p-5 lg:p-6'>
          <div className='grid grid-cols-1 text-sm text-gray-700 md:grid-cols-2 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-3 sm:gap-y-4 sm:text-base'>
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
    </div>
  );
};

export default UserInfo;