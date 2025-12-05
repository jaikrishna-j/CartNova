import React from 'react'

const PlaceHolder = () => {
  return (
    <div className="col-md-3 mb-5">
        <div className='card bg-white border border-gray-200' aria-hidden="true">
            <div
                className='place-img bg-gray-200'
                style={{height: "108px"}}
            ></div>
            <div className='card-body bg-white'>
                <p className='card-text placeholder-glow'>
                    <span className='placeholder col-12 placeholder-xs bg-gray-200'></span>
                    <span className='placeholder col-12 placeholder-xs bg-gray-200'></span>
                </p>
            </div>
        </div>
    </div>
  )
}

export default PlaceHolder