import React from 'react'
import PlaceHolder from './PlaceHolder'

const PlaceHolderContainer = ({ isSearch = false, gridCols = 'lg:grid-cols-4', noWrapper = false }) => {

  const placeNumbers = [...Array(8).keys()].slice(0);

  const gridContent = (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-6`}>
      {placeNumbers.map(num => <PlaceHolder key={num} />)}
    </div>
  );

  // If noWrapper is true, just return the grid (for Store page when already inside a container)
  if (noWrapper) {
    return gridContent;
  }

  // Full wrapper for HomePage
  return (
    <section
      className={`py-8 sm:py-12 bg-gray-50 ${isSearch ? 'pt-0' : 'pt-20'}`}
      id="products"
    >
      {!isSearch && (
        <h4 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-8 sm:mt-12 font-extrabold text-gray-800 mb-6 sm:mb-8 tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Our Featured Products
        </h4>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {gridContent}
      </div>
    </section>
  )
}

export default PlaceHolderContainer