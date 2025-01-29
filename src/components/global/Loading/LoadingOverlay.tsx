import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player'
import loadingAnimation from '../../../../public/loadingIcon.json'

const LoadingOverlay: React.FC<{ loading: boolean }> = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className="fixed inset-0 bg-[#d0cece54] backdrop-blur-[2px] flex justify-center items-center z-[1000] pointer-events-none">
            <div className='pointer-events-none'>
                <Player
                    src={loadingAnimation}
                    loop
                    autoplay
                    style={{ height: '500px', width: '500px' }}
                />
            </div>
        </div>
    );
};

export default LoadingOverlay;
