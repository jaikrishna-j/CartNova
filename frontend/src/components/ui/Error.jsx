import React from 'react'

const Error = ({error}) => {
  return (
    <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg mb-4' role='alert'>
      {error}
    </div>
  )
}

export default Error
