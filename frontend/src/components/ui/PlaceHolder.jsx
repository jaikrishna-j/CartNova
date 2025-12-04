import React from 'react'

const PlaceHolder = () => {
  return (
    <div className="col-md-3 mb-5">
        <div className='card' aria-hidden="true">
            <div
                className='place-img'
                style={{height: "108px", backgroundColor: "lightgray"}}
            ></div>
            <div className='card-body'>
                <p className='card-text placeholder-glow'>
                    <span className='placeholder col-12 placeholder-xs'></span>
                    <span className='placeholder col-12 placeholder-xs'></span>
                </p>
            </div>
        </div>
    </div>
  )
}

export default PlaceHolder