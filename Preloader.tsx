import React from "react";

interface PreloaderProps {
    rowCount?: number;
    forEnhancedShadowDom?: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({  forEnhancedShadowDom = false }) => {
    return (
        <div className="w-full">
            {forEnhancedShadowDom ? (
                // Customized for EnhancedShadowDomContainer
              <div className="relative h-screen bg-gray-300 overflow-hidden rounded-md">
                    <div className="skeleton-wave" />
                </div>
            ) : (
                // Default skeleton rows
                <div className="grid gap-3">
                    <div className="relative skeleton-row">
                        <div className="skeleton-wave"></div>
                    </div>
                    <div className="relative skeleton-row">
                        <div className="skeleton-wave"></div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Preloader;
