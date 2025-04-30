import React from 'react';
import Button from '@/components/global/Button';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import StatusLegend from './StatusLegend';
import { useEditAssetStoreSelector } from '@/store/editAssetStore';

interface EditHeaderProps {
    isShowSave: boolean;
    setShowSave: (show: boolean) => void;
    handleSave: (type: number) => void;
    setIsShowSubmitVer: (show: boolean) => void;
}

const EditHeader: React.FC<EditHeaderProps> = ({
    isShowSave,
    setShowSave,
    handleSave,
    setIsShowSubmitVer
}) => {

    const uniquesStatusesList = useEditAssetStoreSelector.use.versionUniqueStatuses()
    
    return (
        <div className='flex justify-between items-center px-14 py-4'>
            <div className='flex-1'>
                <StatusLegend statusList={uniquesStatusesList} />
            </div>
            <div className='flex gap-4'>
                <div className='relative w-[150px] bg-white shadow-sm rounded'>
                    <div 
                        onClick={() => setShowSave(!isShowSave)} 
                        className='flex items-center justify-between px-4 py-2 cursor-pointer'
                    >
                        <p className='text-base px-2'>Download</p>
                        <span className={`cursor-pointer transition-transform ${isShowSave ? "rotate-180" : ""}`}>
                            <MdOutlineKeyboardArrowDown size={25} />
                        </span>
                    </div>
                    {isShowSave && (
                        <div className="absolute z-[100] w-full bg-white shadow-sm flex flex-col rounded-b-md px-2 py-1">
                            <button onClick={() => handleSave(2)} className="h-[40px] flex items-center justify-between px-4 hover:bg-[#00A8811A] hover:text-white rounded">
                                <div className="text-black text-base font-normal">HTML File</div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 17.3625C11.8 17.3625 11.6125 17.3315 11.4375 17.2695C11.2625 17.2075 11.1 17.101 10.95 16.95L5.55 11.55C5.25 11.25 5.106 10.9 5.118 10.5C5.13 10.1 5.274 9.75 5.55 9.45C5.85 9.15 6.2065 8.994 6.61949 8.982C7.03249 8.97 7.38849 9.1135 7.68749 9.4125L10.5 12.225V1.5C10.5 1.075 10.644 0.719005 10.932 0.432005C11.22 0.145005 11.576 0.00100517 12 5.17241e-06C12.424 -0.000994827 12.7805 0.143005 13.0695 0.432005C13.3585 0.721005 13.502 1.077 13.5 1.5V12.225L16.3125 9.4125C16.6125 9.1125 16.969 8.9685 17.382 8.9805C17.795 8.9925 18.151 9.149 18.45 9.45C18.725 9.75 18.869 10.1 18.882 10.5C18.895 10.9 18.751 11.25 18.45 11.55L13.05 16.95C12.9 17.1 12.7375 17.2065 12.5625 17.2695C12.3875 17.3325 12.2 17.3635 12 17.3625ZM3 24C2.175 24 1.469 23.7065 0.881999 23.1195C0.294999 22.5325 0.000999999 21.826 0 21V18C0 17.575 0.144 17.219 0.432 16.932C0.72 16.645 1.076 16.501 1.5 16.5C1.924 16.499 2.2805 16.643 2.5695 16.932C2.8585 17.221 3.002 17.577 3 18V21H21V18C21 17.575 21.144 17.219 21.432 16.932C21.72 16.645 22.076 16.501 22.5 16.5C22.924 16.499 23.2805 16.643 23.5695 16.932C23.8585 17.221 24.002 17.577 24 18V21C24 21.825 23.7065 22.5315 23.1195 23.1195C22.5325 23.7075 21.826 24.001 21 24H3Z" fill="#00A881" />
                                </svg>
                            </button>
                            <button onClick={() => handleSave(3)} className="h-[40px] flex items-center justify-between px-4 hover:bg-[#00A8811A] hover:text-white rounded">
                                <div className="text-black text-base font-normal">Zip File</div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 17.3625C11.8 17.3625 11.6125 17.3315 11.4375 17.2695C11.2625 17.2075 11.1 17.101 10.95 16.95L5.55 11.55C5.25 11.25 5.106 10.9 5.118 10.5C5.13 10.1 5.274 9.75 5.55 9.45C5.85 9.15 6.2065 8.994 6.61949 8.982C7.03249 8.97 7.38849 9.1135 7.68749 9.4125L10.5 12.225V1.5C10.5 1.075 10.644 0.719005 10.932 0.432005C11.22 0.145005 11.576 0.00100517 12 5.17241e-06C12.424 -0.000994827 12.7805 0.143005 13.0695 0.432005C13.3585 0.721005 13.502 1.077 13.5 1.5V12.225L16.3125 9.4125C16.6125 9.1125 16.969 8.9685 17.382 8.9805C17.795 8.9925 18.151 9.149 18.45 9.45C18.725 9.75 18.869 10.1 18.882 10.5C18.895 10.9 18.751 11.25 18.45 11.55L13.05 16.95C12.9 17.1 12.7375 17.2065 12.5625 17.2695C12.3875 17.3325 12.2 17.3635 12 17.3625ZM3 24C2.175 24 1.469 23.7065 0.881999 23.1195C0.294999 22.5325 0.000999999 21.826 0 21V18C0 17.575 0.144 17.219 0.432 16.932C0.72 16.645 1.076 16.501 1.5 16.5C1.924 16.499 2.2805 16.643 2.5695 16.932C2.8585 17.221 3.002 17.577 3 18V21H21V18C21 17.575 21.144 17.219 21.432 16.932C21.72 16.645 22.076 16.501 22.5 16.5C22.924 16.499 23.2805 16.643 23.5695 16.932C23.8585 17.221 24.002 17.577 24 18V21C24 21.825 23.7065 22.5315 23.1195 23.1195C22.5325 23.7075 21.826 24.001 21 24H3Z" fill="#00A881" />
                                </svg>
                            </button>
                            <button onClick={() => handleSave(4)} className="h-[40px] flex items-center justify-between px-4 hover:bg-[#00A8811A] hover:text-white rounded">
                                <div className="text-black text-base font-normal">PDF File</div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 17.3625C11.8 17.3625 11.6125 17.3315 11.4375 17.2695C11.2625 17.2075 11.1 17.101 10.95 16.95L5.55 11.55C5.25 11.25 5.106 10.9 5.118 10.5C5.13 10.1 5.274 9.75 5.55 9.45C5.85 9.15 6.2065 8.994 6.61949 8.982C7.03249 8.97 7.38849 9.1135 7.68749 9.4125L10.5 12.225V1.5C10.5 1.075 10.644 0.719005 10.932 0.432005C11.22 0.145005 11.576 0.00100517 12 5.17241e-06C12.424 -0.000994827 12.7805 0.143005 13.0695 0.432005C13.3585 0.721005 13.502 1.077 13.5 1.5V12.225L16.3125 9.4125C16.6125 9.1125 16.969 8.9685 17.382 8.9805C17.795 8.9925 18.151 9.149 18.45 9.45C18.725 9.75 18.869 10.1 18.882 10.5C18.895 10.9 18.751 11.25 18.45 11.55L13.05 16.95C12.9 17.1 12.7375 17.2065 12.5625 17.2695C12.3875 17.3325 12.2 17.3635 12 17.3625ZM3 24C2.175 24 1.469 23.7065 0.881999 23.1195C0.294999 22.5325 0.000999999 21.826 0 21V18C0 17.575 0.144 17.219 0.432 16.932C0.72 16.645 1.076 16.501 1.5 16.5C1.924 16.499 2.2805 16.643 2.5695 16.932C2.8585 17.221 3.002 17.577 3 18V21H21V18C21 17.575 21.144 17.219 21.432 16.932C21.72 16.645 22.076 16.501 22.5 16.5C22.924 16.499 23.2805 16.643 23.5695 16.932C23.8585 17.221 24.002 17.577 24 18V21C24 21.825 23.7065 22.5315 23.1195 23.1195C22.5325 23.7075 21.826 24.001 21 24H3Z" fill="#00A881" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
                <div className='h-full w-[1.5px] bg-sectionGrey'></div>
                <Button 
                    buttonText='Submit' 
                    handleClick={() => setIsShowSubmitVer(true)} 
                    showIcon={false} 
                    customClass='px-10 py-1' 
                />
            </div>
        </div>
    );
};

export default EditHeader; 