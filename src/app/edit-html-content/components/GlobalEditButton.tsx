import React from 'react';
import { GlobalEdit } from '@/assets/icons/AppIcons';
import { useSearchParams } from 'next/navigation';
interface GlobalEditButtonProps {
    onClick: () => void;
}

const GlobalEditButton: React.FC<GlobalEditButtonProps> = ({ onClick }) => {

    const searchParams = useSearchParams()

    const assetTypeIcon = searchParams.get('assetTypeIcon')


    return (
        <div

        className={`absolute top-4 ${assetTypeIcon === 'Email' ? 'left-[-3rem]' : assetTypeIcon === 'Landing Page' ? 'left-[-3rem]' : ''} transform group cursor-pointer z-[99]`}            onClick={onClick}
        >
            <div id="global_edit_button" typeof="button">
                <GlobalEdit />
            </div>
            {/* Tooltip */}
            <div className="z-[1000] invisible group-hover:visible opacity-0 group-hover:opacity-100 group-hover:animate-hideTooltip absolute top-0 -left-10 bg-gray-300 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                Global Edit
            </div>
        </div>
    );
};

export default GlobalEditButton; 