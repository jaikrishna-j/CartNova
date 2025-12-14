import React from 'react'

const PlaceHolder = () => {
  return (
    <div className="flex flex-col aspect-square bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
        <div className="relative w-full flex-[0_0_65%] bg-gray-50 flex items-center justify-center overflow-hidden">
            <div className="w-[75%] aspect-square bg-gray-200 rounded"></div>
        </div>
        <div className="px-3 pt-2.5 pb-3 flex flex-col flex-1 min-h-0">
            <div className="space-y-1.5 flex-shrink-0">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="mt-auto pt-2 flex justify-between items-center border-t border-gray-100 flex-shrink-0">
                <div className="h-5 bg-gray-300 rounded w-1/3"></div>
            </div>
        </div>
    </div>
  )
}

export default PlaceHolder