import { CloseIcon } from '@/assets/icons/AssetIcons';
import FilterDropdown from '@/components/global/FilterDropdown';
import Popup from '@/components/global/Popup/Popup';
// import Tooltip from '@/components/global/Tooltip';
import { Dimension, MediaItem, Orientation, Version } from '@/types/visualLibrary';
import { findAspectRatio } from '@/utils/miscellaneous';
import { Tooltip } from '@mui/material';
import { Crop, Scaling, SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';
import React, { FC, memo,useRef, useEffect, useState, Dispatch, SetStateAction } from 'react';
// import { IoMdClose } from "react-icons/io";

type DialogueMainProps = {
    setOrientationFilter: (orientation: Orientation) => void;
    setOpenSelectedMediaPreview: (state: boolean) => void;
    handleSelect: (item: MediaItem) => void;
    setSelectedImageVersion: (item: Version | null) => void;
    onApplyCustomDimension : (dimension:Dimension,visualID:string) => void
    setImageEditWindow : Dispatch<SetStateAction<boolean>>
    selectedImageVersion: Version | null;
    openSelectedMediaPreview: boolean;
    orientationFilter: string;
    filteredMedia: MediaItem[];
    selectedImage: MediaItem | null;
    allowedOrientations: Orientation[];
};

type Dimensions = {
    width: number;
    height: number;
};

type DropdownOption = {
    label: string;
    value: string;
};

const DialogueMain: FC<DialogueMainProps> = ({
    setOrientationFilter,
    handleSelect,
    setOpenSelectedMediaPreview,
    setSelectedImageVersion,
    onApplyCustomDimension,
    setImageEditWindow,
    selectedImageVersion,
    openSelectedMediaPreview,
    orientationFilter,
    filteredMedia,
    selectedImage,
    allowedOrientations
}) => {
    const selectedImageDimensions = selectedImage?.versions.find(item => item.versionLabel === "Original");
    
    // const cropButtonRef = useRef(null)

    const [dimensions, setDimensions] = useState<Dimensions>({ 
        width: selectedImageDimensions?.width || 150, 
        height: selectedImageDimensions?.height || 80 
    });

    const [aspectRationSelectedVersion,setAspectRationSelectedVersion] = useState<{w_part:number,h_part:number}> 
        (selectedImageVersion?.width === selectedImageVersion?.height 
            ? {w_part:1,h_part:1} 
            : findAspectRatio(selectedImageVersion?.width,selectedImageVersion?.height)
        )
    
    const [canEditWidth,setCanEditWidth] = useState<boolean>(true)
    const [canEditHeight,setCanEditHeight] = useState<boolean>(true)
    
    const [inputWidth, setInputWidth] = useState<string>(
        selectedImageDimensions?.width?.toString() || '150'
    );
    
    const [inputHeight, setInputHeight] = useState<string>(
        selectedImageDimensions?.height?.toString() || '80'
    );
    
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [containerSize, setContainerSize] = useState<Dimensions>({ width: 300, height: 200 });
    const [scale, setScale] = useState<number>(1);

    useEffect(() => {
        if (selectedImageDimensions?.width && selectedImageDimensions?.height) {
            setDimensions({
                width: selectedImageDimensions.width,
                height: selectedImageDimensions.height
            });
            setInputWidth(selectedImageDimensions.width.toString());
            setInputHeight(selectedImageDimensions.height.toString());
        }
    }, [selectedImageDimensions]);

    useEffect(() => {
        if (containerRef.current) {
            const updateContainerSize = (): void => {
                const containerWidth = containerRef.current?.clientWidth || 0;
                const containerHeight = containerRef.current?.clientHeight || 0;
                
                setContainerSize({
                    width: containerWidth,
                    height: containerHeight
                });
            };

            updateContainerSize();
            window.addEventListener('resize', updateContainerSize);
            return () => window.removeEventListener('resize', updateContainerSize);
        }
    }, []);

    useEffect(() => {
        const widthScale = containerSize.width / dimensions.width;
        const heightScale = containerSize.height / dimensions.height;
        const newScale = Math.min(widthScale, heightScale, 1);
        setScale(newScale);
    }, [dimensions, containerSize]);

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = parseInt(e.target.value)
        const height = value * (aspectRationSelectedVersion.h_part/aspectRationSelectedVersion.w_part)
        setInputWidth(e.target.value);
        setInputHeight(height.toString())
        
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = parseInt(e.target.value)
        const width = value * (aspectRationSelectedVersion.w_part/aspectRationSelectedVersion.h_part)
        setInputHeight(e.target.value)
        setInputWidth(width.toString())
    };

    useEffect(()=>{
      const newWidth = parseInt(inputWidth) || 0;
      const newHeight = parseInt(inputHeight) || 0;
      setDimensions({
          width: Math.max(newWidth, 10),
          height: Math.max(newHeight, 10)
      });
    },[inputHeight,inputWidth])

    // const handleResize = (): void => {
    //     const newWidth = parseInt(inputWidth) || 0;
    //     const newHeight = parseInt(inputHeight) || 0;
    //     setDimensions({
    //         width: Math.max(newWidth, 10),
    //         height: Math.max(newHeight, 10)
    //     });
        
    // };

    const resolutionOptionsList: DropdownOption[] | undefined = selectedImage?.versions.map(version => {
        return {
            label: `${version.versionLabel} : ${version.width} x ${version.height}`,
            value: version.versionID
        };
    });

    const [originalRendered, setOriginalRendered] = useState<boolean>(false);
    const [showResizePopup, setResizePopup] = useState<boolean>(false);

    const updateResizePopupPresence = (): void => {
        setResizePopup(prev => !prev);
    };

    if (!openSelectedMediaPreview) {
        return (
            <div className="p-4 flex-1 overflow-auto">
                <div className="mb-4">
                    <div className="flex gap-2">
                        {allowedOrientations.length > 2 && allowedOrientations.map((orientation) => (
                            <button
                                key={orientation}
                                onClick={() => setOrientationFilter(orientation)}
                                className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${orientationFilter === orientation
                                        ? 'bg-[#00A881] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {orientation.charAt(0).toUpperCase() + orientation.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="columns-2 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {filteredMedia.map((media) => (
                        <div
                            key={media.fileID}
                            onClick={() => handleSelect(media)}
                            className={`
                                cursor-pointer break-inside-avoid rounded-lg overflow-hidden border transition-all
                                ${selectedImage?.fileURL === media.fileURL
                                    ? 'border-green-500 ring-2 ring-green-500'
                                    : 'border-gray-200 hover:border-green-500'
                                }
                            `}
                        >
                            <div
                                className='w-full object-cover transition-transform duration-300 group-hover:scale-105 relative group'
                                onClick={() => {
                                    handleSelect(media);
                                    setOpenSelectedMediaPreview(true);
                                }}
                            >
                                <Image
                                    src={media.versions.find(item => item.versionLabel === "thumbnail")?.fileURL || ""}
                                    alt={media.title}
                                    width={media.versions.find(item => item.versionLabel === "thumbnail")?.width || 300}
                                    height={media.versions.find(item => item.versionLabel === "thumbnail")?.height || 200}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 max-h-72"
                                />
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-25 transition-opacity duration-300" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <SquareArrowOutUpRight className="text-grey-200" size={30} />
                                </div>
                            </div>

                            <div className="p-3">
                                <h3 className="font-semibold text-gray-900">{media.title}</h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{media.description}</p>
                                <span className="text-xs text-gray-500 mt-2 block">
                                    {media.versions.find(item => item.versionLabel === "thumbnail")?.orientation}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    else {
        // for editing and viewing selected image
        return (
            <>
                {/* <Tooltip 
                    tip='Crop image'
                    anchorRef={cropButtonRef}
                    // toolTipClass='opacity-0 z-99 group-hover:opacity-100'
                    toolTipClass='z-99'
                /> */}
                <div className='flex flex-1 gap-3 overflow-hidden'>
                    {/* image section  */}
                    <div className='w-1/2 relative overflow-scroll scrollbar-none'>
                        {!originalRendered && (
                            <>
                                <img
                                    src={selectedImage?.versions.find(item => item.versionLabel === "thumbnail")?.fileURL}
                                    alt={`${selectedImage?.title}_thumbnail`}
                                    width={selectedImage?.versions.find(item => item.versionLabel === "Original")?.width}
                                    height={selectedImage?.versions.find(item => item.versionLabel === "Original")?.height}
                                    className="w-full p-2 object-cover blur-md transition-transform duration-300"
                                />
                            </>
                                
                        )}
                        {/* the above will render while the original render to dom, once the original image render 'thumbnail' will be hidden */}
                        <img
                            src={selectedImageVersion?.fileURL}
                            alt={selectedImage?.title || ""}
                            width={selectedImage?.versions.find(item => item.versionLabel === "Original")?.width}
                            height={selectedImage?.versions.find(item => item.versionLabel === "Original")?.height}
                            className="w-full p-2 object-cover transition-transform duration-300"
                            onLoad={() => setOriginalRendered(true)}
                            style={{ opacity: originalRendered ? 1 : 0 }}
                        />
                        <button 
                        onClick={()=>{setImageEditWindow(true)}}
                        className='absolute top-0 mr-1 mt-1 p-2 right-0 rounded-sm bg-green-50 outline-dashed outline-offset-2 outline-1 outline-green-50 group:'
                        >
                            <Tooltip title="Crop Image">
                                <Crop 
                                    className='opacity-75 text-green-100'
                                    size={12}
                                />
                            </Tooltip>
                        </button>

                    </div>
                    {/* options section  */}
                    <div className='w-1/2 mx-2'>
                        <h3 className='font-semibold text-lg pt-1'>{selectedImage?.title}</h3>
                        <div className='mt-3 flex gap-2 '>
                            <FilterDropdown
                                placeholder='chosen value'
                                optionLists={resolutionOptionsList || []}
                                topLevelClass='w-full'
                                customClass='rounded-sm w-full'
                                selectedValueClass='text-grey-300'
                                optionsListClass='w-full rounded-none'
                                defaultSelectedLabel={`${selectedImageVersion?.versionLabel} : ${selectedImageVersion?.width} x ${selectedImageVersion?.height}`}
                                defaultSelectedOption={`${selectedImageVersion?.versionID}`}
                                allowDrop = {!showResizePopup}
                                selectedValue={(value: string) => {
                                    const newVersion = selectedImage?.versions.find(v => v.versionID === value) || null;
                                    setSelectedImageVersion(newVersion);
                                    
                                    // Update dimensions when version changes
                                    if (newVersion) {
                                        setDimensions({
                                            width: newVersion.width,
                                            height: newVersion.height
                                        });
                                        setInputWidth(newVersion.width.toString());
                                        setInputHeight(newVersion.height.toString());
                                        setAspectRationSelectedVersion( newVersion.width === newVersion.height ? {w_part:1,h_part:1} : findAspectRatio(newVersion.width,newVersion.height))
                                    }
                                }}
                            />
                            <div className='relative flex items-center'>
                                <div
                                    className='flex cursor-pointer h-[34px] items-center p-2 rounded-lg hover:bg-gray-100 hover:rounded-2xl'
                                    onClick={updateResizePopupPresence}
                                >
                                    <Scaling color='#01a982' />
                                </div>
                                <Popup
                                    isPopupVisible={showResizePopup}
                                    className='absolute z-40 right-[48px] w-[386px] top-[40px] p-2 bg-gray-50 shadow-dropdown-shadow rounded-lg border border-gray-200  transition-all duration-300'
                                >
                                    <form 
                                    className="bg-gray-50 rounded-lg"
                                    onSubmit={(e)=>{
                                        e.preventDefault()
                                        onApplyCustomDimension({width:inputWidth,height:inputHeight},selectedImage?.visualID || "")
                                        setResizePopup(false)
                                    }}
                                    >
                                        <button 
                                        className='absolute top-1 right-1'
                                        onClick={updateResizePopupPresence}
                                        >
                                        <CloseIcon 
                                            color='grey'
                                            width= {15}
                                            height= {15}
                                        />
                                        </button>
                                        <div className="flex items-center">
                                            <div className="flex flex-col gap-1 mr-4">
                                                <input
                                                    type="number"
                                                    placeholder="Width"
                                                    disabled = {!canEditWidth}
                                                    value={inputWidth}
                                                    onChange={handleWidthChange}
                                                    onFocus={()=>setCanEditHeight(false)}
                                                    onBlur={()=>setCanEditHeight(true)}
                                                    className="px-2  border rounded outline-none"
                                                />
                                                <div className="flex justify-center">
                                                </div>
                                                <input
                                                    type="number"
                                                    placeholder="Height"
                                                    disabled = {!canEditHeight}
                                                    value={inputHeight}
                                                    onChange={handleHeightChange}
                                                    onFocus={()=>setCanEditWidth(false)}
                                                    onBlur={()=>setCanEditWidth(true)}
                                                    className="px-2  border rounded outline-none"
                                                />
                                                <p className='text-xs text-center text-grey-200'>
                                                aspect ration of the this image is fixed to {aspectRationSelectedVersion.w_part} : {aspectRationSelectedVersion.h_part}
                                                </p>

                                                <div className="mt-2 flex justify-center">
                                                    <button
                                                        type='submit'
                                                        className="py-1 px-2 bg-green-300 text-white rounded text-sm"
                                                    >
                                                        Create New Version
                                                    </button>
                                                </div>
                                            </div>
                                            <div
                                                ref={containerRef}
                                                className="w-full h-36 p-[0.6rem] flex justify-center items-center overflow-hidden"
                                            >
                                                <div
                                                    style={{
                                                        width: `${dimensions.width * scale}px`,
                                                        height: `${dimensions.height * scale}px`,
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        transformOrigin: 'center'
                                                    }}
                                                    className="border border-dashed border-gray-400 transition-all duration-300 flex items-center justify-center"
                                                >
                                                    <span className="text-xs text-gray-500">{dimensions.width} x {dimensions.height}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </Popup>
                            </div>
                        </div>
                        <p className='text-grey-300 mt-2 text-sm'>Size: {selectedImageVersion?.fileSizeKB} KB</p>
                        <div className='relative'>
                        {/* <div className='absolute bg-grey-800 min-h-[100%] opacity-35 top-0 bottom-0 right-0 left-0'></div> */}
                        <div className='mt-3 flex gap-2 flex-wrap'>
                            {selectedImageVersion && (
                                <h4 className='text-green'>Orientation: <span className='bg-blue-50 text-blue-700 py-[0.5px] px-2 rounded-full'>{selectedImageVersion.orientation}</span></h4>
                            )}
                        </div>
                        <div className='mt-3 flex gap-2 flex-wrap'>
                            {selectedImage?.tags && <h4>Tags:</h4>}
                            {selectedImage?.tags &&
                                selectedImage?.tags.split(',').map((str: string) => (
                                    <div key={str} className='bg-blue-50 text-blue-700 py-[0.5px] px-2 rounded-full'>{str}</div>
                                ))
                            }
                        </div>
                        <p className='mt-3'>{selectedImage?.description}</p>
                        </div>
                    </div>
                </div>
            </>

        );
    }
};

export default memo(DialogueMain);