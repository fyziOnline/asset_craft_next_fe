import React from "react";

interface PreloaderProps {
    rowCount?: number;
    rowHeight?: string;
    forEnhancedShadowDom?: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({
    rowCount = 3,
    rowHeight = "75px",
    forEnhancedShadowDom = false,
}) => {
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
                    {Array.from({ length: rowCount }).map((_, index) => (
                        <div
                            key={index}
                            className="relative skeleton-row"
                            style={{ height: rowHeight }}
                        >
                            <div className="skeleton-wave"></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Preloader;
