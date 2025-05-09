"use client";

import { useAppNavigation } from '@/hooks/useAppNavigation';

const GoBackButton = () => {
    const { navigateToPreviousPage } = useAppNavigation()
    return (
        <div className='cursor-pointer flex items-center' onClick={navigateToPreviousPage}>
            <svg width="9" height="16" viewBox="0 0 7 14" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.64645 6.94975L6.19972 1.39647V2.55381L1.80378 6.94975L6.19972 11.3457V12.503L0.64645 6.94975Z" fill="#00a881" stroke="#00a881" stroke-width="1.25" />
            </svg>
        </div>
    )
}

export default GoBackButton;