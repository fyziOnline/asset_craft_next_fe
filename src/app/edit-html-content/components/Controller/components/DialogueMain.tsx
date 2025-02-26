import FilterDropdown from '@/components/global/FilterDropdown';
import Popup from '@/components/global/Popup/Popup';
import { MediaItem, Orientation, Version } from '@/types/visualLibrary'
import { Scaling, SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';
import { FC, memo, useState } from 'react'

type DialogueMainProps = {
    setOrientationFilter: (orientation: Orientation) => void
    setOpenSelectedMediaPreview: (state:boolean) => void
    handleSelect: (item: MediaItem) => void
    setSelectedImageVersion : (item:Version|null) => void
    selectedImageVersion : Version | null
    openSelectedMediaPreview : boolean
    orientationFilter : string
    filteredMedia : MediaItem[]
    selectedImage : MediaItem | null
    allowedOrientations : Orientation[]
}

const DialogueMain:FC<DialogueMainProps> = ({
    setOrientationFilter,
    handleSelect,
    setOpenSelectedMediaPreview,
    setSelectedImageVersion,
    selectedImageVersion,
    openSelectedMediaPreview,
    orientationFilter,
    filteredMedia,
    selectedImage,
    allowedOrientations
}) => {
  const resolutionOptionsList = selectedImage?.versions.map(version => {
    console.log(version);
    
    return {
      label: `${version.versionLabel} : ${version.width} x ${version.height}`,
      value: version.versionID
    };
  })
  // const originalVersion = selectedImage?.versions.find(v => v.versionLabel === 'Original' || v.orientation === 'Original')

  const [originalRendered,setOriginalRendered] = useState<boolean>(false)
  // const [selectedImageVersion,setSelectedImageVersion] = useState<Version | null>(originalVersion || selectedImage?.versions[0] || null)
  const [showResizePopup,setResizePopup] = useState<boolean>(false)

  // useEffect(() => {
  //   if (selectedImage && selectedImage.versions && selectedImage.versions.length > 0) {
  //     const originalVersion = selectedImage.versions.find(v => v.versionLabel === 'Original' || v.orientation === 'Original')
  //     setSelectedImageVersion(originalVersion || selectedImage.versions[0])
  //   }
  // }, [selectedImage]) 

  
  const updateResizePopupPresence = () => {
    setResizePopup(pre => !pre)
  }

  if (!openSelectedMediaPreview) {
      return (
        <div className="p-4 flex-1 overflow-auto">
          <div className="mb-4">
            <div className="flex gap-2">
              {allowedOrientations.length>2 && allowedOrientations.map((orientation) => (
                <button
                  key={orientation}
                  onClick={() => setOrientationFilter(orientation)}
                  className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                    orientationFilter === orientation
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
            {filteredMedia.map((media, index) => (
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
                  onClick={()=>{
                    handleSelect(media)
                    setOpenSelectedMediaPreview(true)
                  }}
                >
                  <Image 
                    src={media.versions.find(item => item.versionLabel === "thumbnail")?.fileURL || ""}
                    alt={media.title}
                    width={media.versions.find(item => item.versionLabel === "thumbnail")?.width || 300} 
                    height={media.versions.find(item => item.versionLabel === "thumbnail")?.width || 200} 
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
      )
  } 
  else {
    // for editing and viewing selected image
    return (
        // <div className={`grid grid-cols-2 ${selectedImage && 'overflow-hidden'}`}>  
        <div className='flex flex-1 gap-3 overflow-hidden'>  
            {/* image section  */}
            <div className='w-1/2 overflow-scroll scrollbar-none'>
                {!originalRendered && <img
                    src={selectedImage?.versions.find(item => item.versionLabel === "thumbnail")?.fileURL}
                    alt={selectedImage?.title + '_thumbnile'}
                    width={selectedImage?.versions.find(item => item.versionLabel === "Original")?.width}
                    height={selectedImage?.versions.find(item => item.versionLabel === "Original")?.height}
                    className=" w-full p-2 object-cover blur-md transition-transform duration-300"
                    // style={{ opacity: originalRendered ? 0 : 1 }}
                />  }
                {/* the above will render while the original render to dom, once the original image render 'thumbnail' will be hidden */}
                <img
                    src={selectedImageVersion?.fileURL}
                    alt={selectedImage?.title}
                    width={selectedImage?.versions.find(item => item.versionLabel === "Original")?.width}
                    height={selectedImage?.versions.find(item => item.versionLabel === "Original")?.height}
                    className=" w-full p-2 object-cover transition-transform duration-300"
                    onLoad={()=>setOriginalRendered(true)}
                    style={{ opacity: originalRendered ?  1 : 0 }}
                />  
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
                      selectedValueClass = 'text-grey-300'
                      optionsListClass = 'w-full rounded-none'
                      defaultSelectedLabel={`${selectedImageVersion?.versionLabel} : ${selectedImageVersion?.width} x ${selectedImageVersion?.height}`}
                      defaultSelectedOption={`${selectedImageVersion?.versionID}`}
                      selectedValue={(value)=>{
                        setSelectedImageVersion(selectedImage?.versions.find(v=>v.versionID===value) || null)
                      }}
                  />
                  <div className='relative flex items-center'>
                    {/* <div 
                      className='flex cursor-pointer items-center p-2 rounded-lg hover:bg-gray-100 hover:rounded-2xl'
                      onClick={updateResizePopupPresence}
                    >
                      <Scaling 
                        color='#01a982'
                      />
                    </div> */}
                    <Popup
                      handleClickOutside={updateResizePopupPresence}
                      isPopupVisible ={showResizePopup}
                      className='absolute right-0 top-full p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition-all duration-300'
                    >
                      <form onSubmit={(e) => {
                        e.preventDefault();
                      }}>
                        <div className='flex gap-2'>
                          <div>
                            <label htmlFor="custom_width" className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                            <input 
                              type="text" 
                              id="custom_width" 
                              name="custom_width" 
                              className="w-fit px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Enter width"
                            />
                          </div>
                          <div>
                            <label htmlFor="custom_height" className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                            <input 
                              type="text" 
                              id="custom_height" 
                              name="custom_height" 
                              className="w-fit px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Enter height"
                            />
                          </div>
                        </div>
                        <button 
                          type="submit" 
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                        >
                          Create
                        </button>
                      </form>
                    </Popup>
                  </div>
                </div>
                <p className='text-grey-300 mt-2 text-sm '>Size : {selectedImageVersion?.fileSizeKB} KB</p>
                <div className='mt-3 flex gap-2 flex-wrap'>
                  {selectedImageVersion && 
                      <h4 className='text-green'>Orientation : <span className='bg-blue-50 text-blue-700 py-[0.5px] px-2 rounded-full'>{selectedImageVersion.orientation}</span></h4>
                  }
                </div>
                <div className='mt-3 flex gap-2 flex-wrap'>
                  {selectedImage?.tags && <h4>Tags :</h4>}
                  {selectedImage?.tags && 
                    selectedImage?.tags.split(',').map(str=>(
                    // <div className='mt-2 '>
                      <div key={str} className='bg-blue-50 text-blue-700 py-[0.5px] px-2 rounded-full'>{str}</div>
                    ))
                  }
                </div>
                <p className='mt-3'>{selectedImage?.description}</p>

            </div>   
        </div>
    )
  }
}

export default memo(DialogueMain)