import React from 'react';

const LoadingOverlay: React.FC<{ loading: boolean }> = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className="fixed inset-0 bg-black opacity-40 flex justify-center items-center z-[1000] pointer-events-none">
            <div className="border-t-4 border-[#00A881] border-solid w-16 h-16 rounded-full animate-spin pointer-events-none"></div>
        </div>
    );
};

export default LoadingOverlay;
