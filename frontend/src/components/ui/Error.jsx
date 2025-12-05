import React from 'react'

const Error = ({error}) => {
  return (
    <div className='bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4' role='alert'>
      {error}
    </div>
  )
}

export default Error
