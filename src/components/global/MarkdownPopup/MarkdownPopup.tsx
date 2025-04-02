import { FC, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { MdOutlineClose } from 'react-icons/md'

interface MarkdownPopupProps {
  markdownContent: string
  promptContent: string
  isOpen: boolean
  onClose: () => void
}

const MarkdownPopup: FC<MarkdownPopupProps> = ({ markdownContent, promptContent, isOpen, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={popupRef}
        className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full max-h-[80vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">AI Data</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <MdOutlineClose size={24} />
          </button>
        </div>
        
        <div className="flex flex-col h-full gap-4">
          {promptContent && (
            <div className="flex flex-col">
              <h4 className="text-md font-medium mb-2">AI Request Prompt</h4>
              <div className="overflow-y-auto custom-scrollbar max-h-[20vh] border border-gray-200 rounded p-3 bg-gray-50">
                <div className="prose max-w-none">
                  <ReactMarkdown>{promptContent}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
          
          {markdownContent && (
            <div className="flex flex-col flex-grow">
              <h4 className="text-md font-medium mb-2">Raw AI Output</h4>
              <div className="overflow-y-auto custom-scrollbar flex-grow max-h-[40vh] border border-gray-200 rounded p-3">
                <div className="prose max-w-none">
                  <ReactMarkdown>{markdownContent}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MarkdownPopup 