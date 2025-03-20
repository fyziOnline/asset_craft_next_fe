import { FC, useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { ScanSearch, Search } from 'lucide-react';
import Button from '@/components/global/Button';
import { useEditAssetSection } from '@/hooks/useEditAssetSection';
import { Dimension, MediaItem, MediaType, Orientation, Version } from '@/types/visualLibrary';
// import DialogueMain from './components/DialogueMain';
// import ImageEditWindow from './components/image-crop-window/ImageCropWindow';
// import { useImageController } from './context/ImageControllerContext';
import { findAspectRatio } from '@/utils/miscellaneous';
import ImageEditWindow from './components/image-crop-window/ImageCropWindow';
// import { useAppData } from '@/context/AppContext';
import SearchBox from "@/components/global/SearchBox";

const DialogueMain = lazy(() => import('./components/DialogueMain'))

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  uischema?: any
}
type aspectRatioObjType = { w_part: number, h_part: number }


export const ImagePicker: FC<ImagePickerProps> = ({ value, onChange, label, uischema }) => {
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null)
  const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all')
  const [orientationFilter, setOrientationFilter] = useState<Orientation>('all')
  const [library, setLibrary] = useState<MediaItem[]>([])
  const [openSelectedMediaPreview, setOpenSelectedMediaPreview] = useState<boolean>(false)
  const [selectedImageVersion, setSelectedImageVersion] = useState<Version | null>(null)
  const [imageOriginalVersion, setImageOriginalVersion] = useState<Version | null>(null)
  const [imageEditWindow, setImageEditWindow] = useState<boolean>(false)
  const [showResizePopup, setResizePopup] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('')

  const {
    getVisualLibrary,
    createMediaAssetVersion,
    getSingleVisualMediaAsset
  } = useEditAssetSection()

  // const {selectedImageVersion,setSelectedImageVersion,setAspectRatioSelectedVersion} = useImageController()
  const [aspectRatioSelectedVersion, setAspectRatioSelectedVersion] = useState<aspectRatioObjType>({ w_part: 0, h_part: 0 })

  // const allowedOrientation:Orientation[] = uischema?.options?.allowedOrientations || ['all', 'landscape', 'portrait', 'square']
  const allowedOrientation: Orientation[] = [
    ...new Set(['all', ...(uischema?.options?.allowedOrientations || ['landscape', 'portrait', 'square'])])
  ]


  const handleOpen = async () => {
    const library: MediaItem[] = await getVisualLibrary({ category: "" })
    setLibrary(library)
    !open && setOpen(true)
  }

  const handleResizeMedia = async (dimension: Dimension) => {
    const visualID = imageOriginalVersion?.visualID
    if (!visualID) {
      console.error('Unable to process the image, Try selecting from the library again');
      return
    }
    const response_createMediaAssetVersion = await createMediaAssetVersion(dimension, visualID)
    if (!response_createMediaAssetVersion?.isSuccess) {
      console.error('unable to resize image now, please try again');
      return
    }
    let response_getSingleVisualMediaAsset = await getSingleVisualMediaAsset(visualID)
    if (!response_getSingleVisualMediaAsset?.isSuccess) {
      console.error('Unable to refetch the updated media now, Please reselect image');
      return
    }
    delete response_getSingleVisualMediaAsset.isSuccess
    delete response_getSingleVisualMediaAsset.errorOnFailure
    await handleSelect(response_getSingleVisualMediaAsset)
    await handleOpen()

  }

  const handleClose = () => {
    setOpen(false)
    setOpenSelectedMediaPreview(false)
    setSelectedImage(null)
    setSearchQuery('');
  }

  const handleSelect = async (image: MediaItem) => {
    setSelectedImage(image)
    const originalImage = image.versions.find(v => v.versionLabel === 'Original') || image.versions[0]
    setImageOriginalVersion(originalImage)
    setSelectedImageVersion(originalImage || null)
    const aspectRatio = findAspectRatio(originalImage.width, originalImage.height)
    setAspectRatioSelectedVersion(aspectRatio)
  }

  const handleConfirm = () => {
    if (selectedImage) {
      onChange(selectedImageVersion?.fileURL || "")
      handleClose()
    }
  }

  const filteredMedia = useMemo(() => {
    return library.filter(item => {
      // Check if the searchQuery matches the title of the media item
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());

      // Check orientation filter
      const matchesOrientation =
        orientationFilter === 'all'
          ? item.versions.some(version =>
            allowedOrientation
              .map(o => o.toLowerCase())
              .includes(version.orientation.toLowerCase())
          )
          : item.versions.some(version =>
            version.orientation.toLowerCase() === orientationFilter.toLowerCase()
          );

      return matchesSearch && matchesOrientation;
    });
  }, [library, orientationFilter, allowedOrientation, searchQuery]);

/*   useEffect(() => {
    console.log("Filtered Media Titles:", filteredMedia.map(item => item.title));
  }, [filteredMedia]); */

  const handleBack = () => {
    setOpenSelectedMediaPreview(false)
    setResizePopup(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {label && (
        <span className="text-sm text-gray-600">
          {label}
        </span>
      )}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder="Enter image URL or select from library"
          />
          <button
            onClick={handleOpen}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2  hover:bg-gray-100 rounded-full"
          >
            <ScanSearch color='#01a982' className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {value && (
          <img
            src={value}
            alt="Selected image preview"
            className="w-16 h-16 object-cover rounded border border-gray-300"
          />
        )}
      </div>

      {open && !imageEditWindow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] min-h-[400px] flex flex-col animate-slideUp">
            {/* header of custom renderer dialogue box  */}
            <div className={`${!openSelectedMediaPreview ? 'p-4 border-b flex justify-between' : 'p-2'}`}>
              {!openSelectedMediaPreview && <h2 className="text-xl font-semibold">Select Image</h2>}
              {!openSelectedMediaPreview && <SearchBox setSearchQuery={setSearchQuery} />}
            </div>

            {/* body of custom renderer dialogue box  */}
            <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
              <DialogueMain
                setOrientationFilter={setOrientationFilter}
                handleSelect={handleSelect}
                orientationFilter={orientationFilter}
                filteredMedia={filteredMedia}
                selectedImage={selectedImage}
                onApplyCustomDimension={handleResizeMedia}
                setImageEditWindow={setImageEditWindow}
                aspectRatioSelectedVersion={aspectRatioSelectedVersion}
                setOpenSelectedMediaPreview={setOpenSelectedMediaPreview}
                openSelectedMediaPreview={openSelectedMediaPreview}
                allowedOrientations={allowedOrientation}
                setSelectedImageVersion={setSelectedImageVersion}
                selectedImageVersion={selectedImageVersion}
                showResizePopup={showResizePopup}
                setResizePopup={setResizePopup}
              />
            </Suspense>

            {/* footer of custom renderer dialogue box  */}
            <div className="p-4 border-t flex justify-between">
              {openSelectedMediaPreview && <button
                onClick={handleBack}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                Back
              </button>}
              {/* dialogue footer right section  */}
              <div className='w-full flex justify-end gap-2'>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedImage}
                  className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${selectedImage
                      ? 'text-white bg-custom-gradient-green'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  Select
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
      {imageEditWindow && (<div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <ImageEditWindow
          setImageEditWindow={setImageEditWindow}
          aspectRatioObjType={aspectRatioSelectedVersion}
          mediaVersionOriginal={selectedImage?.versions.find(v => v.versionLabel === 'Original') || selectedImage?.versions[0] || null}
          thumbnileUrl={selectedImage?.versions.find(v => v.versionLabel === 'thumbnail')?.fileURL || ""}
        />
      </div>)}
    </div>
  );
};