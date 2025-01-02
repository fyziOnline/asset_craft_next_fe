import React from 'react';

const LoadingOverlay: React.FC<{ loading: boolean }> = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-45 flex justify-center items-center z-[1000]">
            <div className="border-t-4 border-[#00A881] border-solid w-16 h-16 rounded-full animate-spin"></div>
        </div>
    );
};

export default LoadingOverlay;
