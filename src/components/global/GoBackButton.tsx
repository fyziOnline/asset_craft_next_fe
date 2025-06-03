"use client";

import { useAppNavigation } from '@/hooks/useAppNavigation';
import { usePathname } from 'next/navigation';
import { useGenerateAssetStoreSelector } from '@/store/generatAssetStore';

const GoBackButton = () => {
    const { navigateToPreviousPage } = useAppNavigation();
    const pathname = usePathname();
    const progressionStep = useGenerateAssetStoreSelector.use.progressionStep();
    const updateProgressionStep = useGenerateAssetStoreSelector.use.updateProgressionStep();

    const handleClick = () => {
        if (pathname === '/generate-asset' && progressionStep === 1) {
            updateProgressionStep('dec');
        } else {
            navigateToPreviousPage();
        }
    };

    return (
        <div
            className="cursor-pointer bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={handleClick}
        >
            <svg width="9" height="14" viewBox="0 0 7 14" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path 
                    d="M0.64645 6.94975L6.19972 1.39647V2.55381L1.80378 6.94975L6.19972 11.3457V12.503L0.64645 6.94975Z" 
                    fill="#00a881" 
                    stroke="#00a881" 
                    strokeWidth="1.25" 
                />
            </svg>
        </div>
    );
};

export default GoBackButton;
