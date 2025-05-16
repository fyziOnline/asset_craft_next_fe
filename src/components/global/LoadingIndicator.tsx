import React from 'react'

const LoadingIndicator = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-10 h-10 border-4 border-t-green-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
    )
}

export default LoadingIndicator