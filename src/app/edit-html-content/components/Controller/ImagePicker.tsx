import { FC, useState, useMemo, useEffect } from 'react';
import { ScanSearch, Search } from 'lucide-react';
import Button from '@/components/global/Button';
import { useEditAssetSection } from '@/hooks/useEditAssetSection';
import { MediaItem, MediaType, Orientation } from '@/types/visualLibrary';
// import { useAppData } from '@/context/AppContext';

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ImagePicker: FC<ImagePickerProps> = ({ value, onChange, label }) => {
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null)
  const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all')
  const [orientationFilter, setOrientationFilter] = useState<Orientation | 'all'>('all')
  const [library,setLibrary] = useState<MediaItem[]>([])

  const {getVisualLibrary} = useEditAssetSection()

  // const { contextData, setContextData } = useAppData();

  const handleOpen = async () => {
    const library: MediaItem[] = await getVisualLibrary({category:""})
    setLibrary(library)
    setOpen(true)
  }
  
  const handleClose = () => {
    setOpen(false)
    setSelectedImage(null)
  }

  const handleSelect = (image: MediaItem) => {
    setSelectedImage(image)
  }

  const handleConfirm = () => {
    if (selectedImage) {
      onChange(selectedImage.versions.find(item=>item.versionLabel==="Original")?.fileURL ||"")
      handleClose()
    }
  }

  const filteredMedia = useMemo(() => {
    return library.filter(item => {
      // const matchesType = typeFilter === 'all' || item.type === typeFilter
      const matchesOrientation = orientationFilter.toLocaleLowerCase() === 'all' || item.versions.find(item => item.orientation.toLowerCase() === orientationFilter.toLocaleLowerCase())
      // return matchesType && matchesOrientation
      return matchesOrientation
    })
  }, [library, typeFilter, orientationFilter])

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
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Select Image</h2>
            </div>
            
            <div className="p-4 flex-1 overflow-auto">
              <div className="mb-4">
                <div className="flex gap-2">
                  {(['all', 'landscape', 'portrait', 'square'] as const).map((orientation) => (
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
                    className={`cursor-pointer rounded-lg overflow-hidden border transition-all opacity-0 animate-fadeInUp ${
                      selectedImage?.fileURL === media.fileURL
                        ? 'border-green-100 ring-2 ring-green-100'
                        : 'border-gray-100 hover:custom-gradient-green'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <div className="aspect-video">
                      <img
                        src={media.versions.find(item => item.versionLabel === "thumbnail")?.fileURL}
                        alt={media.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold">{media.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{media.description}</p>
                      <span className="text-xs text-gray-500 mt-2 block">
                        {media.versions.find(item => item.versionLabel === "thumbnail")?.orientation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
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
      )}
    </div>
  );
};