import React from "react";

const ButtonSkeletonLoader = () => {
    return (
        <div className="flex gap-6 w-full">
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={index}
                    className="h-[41.7778px] flex-1 rounded-full bg-gray-100 animate-pulse"
                />
            ))}
        </div>

    );
};

export default ButtonSkeletonLoader;
