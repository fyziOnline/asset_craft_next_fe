import { FC, useState, useMemo, useEffect } from 'react';
import { ScanSearch, Search } from 'lucide-react';
import Button from '@/components/global/Button';
import { useEditAssetSection } from '@/hooks/useEditAssetSection';
import { MediaItem, MediaType, Orientation, Version } from '@/types/visualLibrary';
import DialogueMain from './components/DialogueMain';
// import { useAppData } from '@/context/AppContext';

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  uischema ?: any
}

export const ImagePicker: FC<ImagePickerProps> = ({ value, onChange, label,uischema }) => {
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null)
  const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all')
  const [orientationFilter, setOrientationFilter] = useState<Orientation>('all')
  const [library,setLibrary] = useState<MediaItem[]>([])
  const [openSelectedMediaPreview,setOpenSelectedMediaPreview] = useState<boolean>(false) 
  const [selectedImageVersion,setSelectedImageVersion] = useState<Version | null>(null)


  const {getVisualLibrary} = useEditAssetSection()

  // const allowedOrientation:Orientation[] = uischema?.options?.allowedOrientations || ['all', 'landscape', 'portrait', 'square']
  const allowedOrientation: Orientation[] = [
    ...new Set(['all', ...(uischema?.options?.allowedOrientations || ['landscape', 'portrait', 'square'])])
  ]
  
  // const { contextData, setContextData } = useAppData();

  const handleOpen = async () => {
    const library: MediaItem[] = await getVisualLibrary({category:""})
    setLibrary(library)
    setOpen(true)
  }
  
  const handleClose = () => {
    setOpen(false)
    setOpenSelectedMediaPreview(false)
    setSelectedImage(null)
  }

  const handleSelect = (image: MediaItem) => {
    setSelectedImage(image)
    setSelectedImageVersion(image.versions.find(v => v.versionLabel === 'Original') || image.versions[0] || null )
  }

  const handleConfirm = () => {
    if (selectedImage) {
      onChange(selectedImageVersion?.fileURL ||"")
      handleClose()
    }
  }

  const filteredMedia = useMemo(() => {
    return library.filter(item => {
      if (orientationFilter === 'all') {
        return item.versions.some(version =>
          allowedOrientation
            .map(o => o.toLowerCase()) 
            .includes(version.orientation.toLowerCase()) 
        );
      } else {
        return item.versions.some(version => 
          version.orientation.toLowerCase() === orientationFilter.toLowerCase()
        )
      }
    })
  }, [library, typeFilter, orientationFilter, allowedOrientation]);

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

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col animate-slideUp">
            {/* header of custom renderer dialogue box  */}
            <div className={`${!openSelectedMediaPreview ? 'p-4 border-b' : 'p-2'}`}>
            {!openSelectedMediaPreview && <h2 className="text-xl font-semibold">Select Image</h2> }
            </div>

            {/* body of custom renderer dialogue box  */}
            <DialogueMain 
              setOrientationFilter= {setOrientationFilter}
              handleSelect={handleSelect}
              orientationFilter={orientationFilter}
              filteredMedia={filteredMedia}
              selectedImage={selectedImage}
              setOpenSelectedMediaPreview={setOpenSelectedMediaPreview}
              openSelectedMediaPreview={openSelectedMediaPreview}
              allowedOrientations={allowedOrientation}
              setSelectedImageVersion={setSelectedImageVersion}
              selectedImageVersion={selectedImageVersion}
            />

            {/* footer of custom renderer dialogue box  */}
            <div className="p-4 border-t flex justify-between">
              {openSelectedMediaPreview && <button
                onClick={()=>setOpenSelectedMediaPreview(false)}
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
                    className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                      selectedImage
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
    </div>
  );
};