import PAGE_COMPONENT, { PageType } from '@/componentsMap/pageMap';
import { useGetTemplates } from '@/hooks/useGetTemplates';
import { ApiService } from '@/lib/axios_generic';
import { AssetVersionProps, Template } from '@/types/templates';
import { Dispatch, FC, SetStateAction, useCallback, memo, useEffect, useState } from 'react';

interface ToggleAsideSectionProps {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    children?: React.ReactNode
    versionSelected: AssetVersionProps | null
}

const ToggleAsideSection: FC<ToggleAsideSectionProps> = memo(({ 
    isOpen, 
    setIsOpen, 
    children, 
    versionSelected 
}) => {
    console.log('versionSelected :',versionSelected);
    
    const toggleAside = useCallback(() => {
        setIsOpen(prev => !prev)
    }, [setIsOpen])
    const [templateDetails,setTemplateDetails] = useState<Template|null>()
    const [bodyError,setBodyError] = useState<string>("")

    const {getTemplateById} = useGetTemplates({type_page:""})

    const fetchTemplateData = async() => {
        try {
            const res_template = await getTemplateById(versionSelected?.templateID)
            console.log(res_template);
            
            setTemplateDetails(res_template)
        } catch (error) {
            alert(ApiService.handleError(error));
        }
    }

    const renderAssetGenerateContent = () => {
        if (!templateDetails?.assetTypeName) {
            setBodyError('Unable to process asset information')
            return null
        }
        const Component = PAGE_COMPONENT[templateDetails?.assetTypeName as PageType]
        return Component ? 
            <>
            <div className='border border-red'>
                <Component params={{template:templateDetails}}/> 
            </div>
            </> : null
    };

    useEffect(()=>{
        console.log(versionSelected);
        
        if (versionSelected?.templateID) {
            fetchTemplateData()
        } else console.error('Error : Unable to process template detail')
    },[versionSelected?.templateID])

    
    return (
        <div className="relative">
            {isOpen && (
                <div className="fixed top-0 right-0 h-full w-[320px] bg-white shadow-lg z-10 overflow-y-auto">
                    {renderAssetGenerateContent()}
                </div>
            )}
            
            <div 
                onClick={toggleAside}
                className="absolute top-[-13px] transform -translate-y-1/2 flex items-center w-[25px] h-14 gap-2.5 px-2 py-[18px] bg-[#00b188] rounded-[10px_0px_0px_10px] cursor-pointer transition-all duration-300"
                style={{ right: isOpen ? '320px' : '0px', zIndex: 20 }}
            >
                <svg 
                    width="8" 
                    height="16" 
                    viewBox="0 0 8 12" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                    <path 
                        d="M1.5 1L6.5 6L1.5 11" 
                        stroke="white" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    )
})


export default ToggleAsideSection