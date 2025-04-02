import React from "react";

interface PreloaderProps {
    rowCount?: number;
}

const Preloader: React.FC<PreloaderProps> = ({ rowCount = 3 }) => {
    return (
        <div className="w-full">
            <div className="grid gap-3">
                <div className="relative skeleton-row">
                    <div className="skeleton-wave"></div>
                </div>
                <div className="relative skeleton-row">
                    <div className="skeleton-wave"></div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
