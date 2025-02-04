import React, { memo } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from '../../../../public/loadingIcon.json';

const LoadingOverlay: React.FC<{ loading: boolean }> = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className="fixed inset-0 bg-[#d0cece54] backdrop-blur-[2px] flex justify-center items-center z-[1000] pointer-events-none">
            <Player
                src={loadingAnimation}
                loop
                autoplay
                style={{ height: '400px', width: '400px' }}
            />
        </div>
    );
};

export default memo(LoadingOverlay);
