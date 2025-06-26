import React, { memo } from 'react';
import dynamic from 'next/dynamic';

import loadingAnimation from '../../../../public/loadingIcon.json';

// Dynamically import
const DynamicPlayer = dynamic(
    () => import('@lottiefiles/react-lottie-player').then(mod => ({ default: mod.Player })),
    { ssr: false }
);

interface LoadingOverlayProps {
    loading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className="fixed inset-0 bg-[#d0cece54] backdrop-blur-[2px] flex justify-center items-center z-[1000] pointer-events-none">
            <DynamicPlayer
                src={loadingAnimation}
                loop
                autoplay
                style={{ height: '400px', width: '400px' }}
            />
        </div>
    );
};

export default memo(LoadingOverlay);
