import React from 'react'

const PlaceHolder = () => {
  return (
    <div className="col-md-3 mb-5">
        <div className='card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700' aria-hidden="true">
            <div
                className='place-img bg-gray-200 dark:bg-gray-700'
                style={{height: "108px"}}
            ></div>
            <div className='card-body bg-white dark:bg-gray-800'>
                <p className='card-text placeholder-glow'>
                    <span className='placeholder col-12 placeholder-xs bg-gray-200 dark:bg-gray-700'></span>
                    <span className='placeholder col-12 placeholder-xs bg-gray-200 dark:bg-gray-700'></span>
                </p>
            </div>
        </div>
    </div>
  )
}

export default PlaceHolder