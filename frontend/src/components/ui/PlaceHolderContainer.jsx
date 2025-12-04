import React from 'react'
import PlaceHolder from './PlaceHolder'

const PlaceHolderContainer = () => {

  const placeNumbers = [...Array(12).keys()].slice(0);

  return (
    <section className='py-5 bg-white dark:bg-gray-900' id='shop'>
        <h4 className='text-center text-2xl font-bold text-gray-900 dark:text-white'>Our Products</h4>
        <div className='container px-4 px-lg-5 mt-5'>
            <div className='row justify-content-center'>
                {placeNumbers.map(num => <PlaceHolder key={num} />)}
            </div>
        </div>
    </section>
  )
}

export default PlaceHolderContainer