import pic from '../../assets/profile_pic.jpg';
import { FiEdit } from 'react-icons/fi';
// Removed 'FiShoppingBag' and 'OrderHistoryItem' as they are no longer needed here

const UserInfo = ({userInfo}) => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-8 items-start'>
      {/* Profile Card */}
      <div className='lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center flex flex-col items-center'>
        <img
          src={pic}
          alt='User Profile'
          className='w-32 h-32 rounded-full mb-4 ring-4 ring-indigo-200 dark:ring-indigo-800'
        />
        <h4 className='text-2xl font-bold text-gray-900 dark:text-white'>
          {`${userInfo.first_name} ${userInfo.last_name}`}
        </h4>
        <p className='text-gray-500 dark:text-gray-400'>{userInfo.email}</p>
        <button className='mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border-none'>
          <FiEdit />
          Edit Profile
        </button>
      </div>

      {/* Account Overview Card */}
      <div className='lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg'>
        <div className='bg-indigo-600 text-white p-3 rounded-t-2xl'>
          <h5 className='text-xl font-bold'>Account Overview</h5>
        </div>
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 dark:text-gray-300'>
            <p>
              <strong className='font-semibold text-gray-800 dark:text-gray-100'>Full Name:</strong> {`${userInfo.first_name} ${userInfo.last_name}`}
            </p>
            <p>
              <strong className='font-semibold text-gray-800 dark:text-gray-100'>Username:</strong> {userInfo.username}
            </p>
            <p>
              <strong className='font-semibold text-gray-800 dark:text-gray-100'>City:</strong> {userInfo.city || 'N/A'}
            </p>
            <p>
              <strong className='font-semibold text-gray-800 dark:text-gray-100'>Email:</strong> {userInfo.email}
            </p>
            <p>
              <strong className='font-semibold text-gray-800 dark:text-gray-100'>State/Country:</strong> {userInfo.state || 'N/A'}
            </p>
            <p>
              <strong className='font-semibold text-gray-800 dark:text-gray-100'>Phone:</strong> {userInfo.phone || 'N/A'}
            </p>
          </div>
        </div>
      </div>
      
      {/* "Recent Items" section has been completely removed. */}

    </div>
  );
};

export default UserInfo;