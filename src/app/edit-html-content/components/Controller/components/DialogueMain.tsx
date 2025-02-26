import FilterDropdown from '@/components/global/FilterDropdown';
import { MediaItem, Orientation } from '@/types/visualLibrary'
import { SquareArrowOutUpRight } from 'lucide-react';
import { FC, useState } from 'react'

type DialogueMainProps = {
    setOrientationFilter: (orientation: Orientation) => void
    setOpenSelectedMediaPreview: (state:boolean) => void
    handleSelect: (item: MediaItem) => void
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
    openSelectedMediaPreview,
    orientationFilter,
    filteredMedia,
    selectedImage,
    allowedOrientations
}) => {
  // const [openSelectedMediaPreview,setOpenSelectedMediaPreview] = useState<boolean>(false) 
  // console.log('====================================');
  // console.log(filteredMedia);
  // console.log(selectedImage);
  // console.log('===================================='); 
  const resolutionOptionsList = selectedImage?.versions.map(version => {
    return {label:`${version.width}X${version.height}`,value:version.versionID}
  })
  // const img_url = "https://stratagile-emailcraft.s3.ap-southeast-1.amazonaws.com/visuallibrary/aa43c23c/20250220181136_hpe202402172523_1600_0_72_rgb_30800_original_1600x1067.jpg"
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
    
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedia.map((media, index) => (
              <div
                key={media.fileID}
                onClick={() => handleSelect(media)}
                className={`
                  cursor-pointer rounded-lg overflow-hidden border transition-all
                  ${selectedImage?.fileURL === media.fileURL
                    ? 'border-green-500 ring-2 ring-green-500'
                    : 'border-gray-200 hover:border-green-500'
                  }
                `}
              >
                <div 
                  className={
                    `${orientationFilter === "all" ? 'aspect-video' 
                      : orientationFilter === "landscape" ? 'aspect-video'
                      : orientationFilter === "portrait" ? 'aspect-auto'
                      : orientationFilter === "square" && 'aspect-square'
                     } relative group`}
                  onClick={()=>{
                    // handleSelect(media)
                    // setOpenSelectedMediaPreview(true)
                  }}
                >
                  <img
                    src={media.versions.find(item => item.versionLabel === "thumbnail")?.fileURL}
                    alt={media.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-25 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <SquareArrowOutUpRight className="text-grey-200" size={30} />
                  </div> */}
                </div>
                
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900">{media.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{media.description}</p>
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
        <div className='grid grid-cols-2'>  
            {/* image section  */}
            <div className=''>
                <img
                    src={selectedImage?.versions.find(item => item.versionLabel === "Original")?.fileURL}
                    alt="demo"
                    className="w-full p-2 h-full object-cover transition-transform duration-300"
                />  
            </div>
            {/* options section  */}
            <div className='w-full'>
                {/* <h3>{selectedImage.}</h3> */}
                <FilterDropdown 
                    placeholder='choosen value'
                    optionLists={resolutionOptionsList || []}
                    selectedValue={(value)=>{

                    }}
                />
                {/* <select name="" id="">

                    <option value="" className='flex justify-between w-full'>
                        <span>Name of the image</span>
                        <span>32.5M</span>
                    </option>
                    <option value="">2</option>
                    <option value="">3</option>
                </select> */}
                <p>description</p>

            </div>   
        </div>
    )
  }
}

export default DialogueMain