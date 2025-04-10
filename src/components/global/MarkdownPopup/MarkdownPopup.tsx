import { FC, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { MdOutlineClose } from 'react-icons/md'

const cleanMarkdownContent = (content: string): string => {
  // Remove ```markdown at start and ``` at end if present
  const trimmed = content.trim()
  if (trimmed.startsWith('```markdown\n') && trimmed.endsWith('```')) {
    return trimmed.slice(11, -3).trim()
  }
  return trimmed
}

interface MarkdownPopupProps {
  markdownContent: string
  promptContent: string
  basePromptContent?: string
  isOpen: boolean
  onClose: () => void
}

const MarkdownPopup: FC<MarkdownPopupProps> = ({ markdownContent, promptContent, basePromptContent, isOpen, onClose }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div 
        ref={popupRef}
        className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-semibold text-gray-700">AI Request & Output</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <MdOutlineClose size={24} />
          </button>
        </div>
        
        <div className="flex flex-col flex-grow overflow-hidden gap-4">
          {/* Combined AI Request Section */} 
          {(basePromptContent || promptContent) && (
            <div className="flex flex-col">
              <h4 className="text-lg font-medium mb-2 text-gray-600">AI Request</h4>
              <div className="overflow-y-auto custom-scrollbar max-h-[25vh] border border-blue-200 rounded p-4 bg-blue-50">
                {basePromptContent && (
                  <div className="mb-3 pb-3 border-b border-blue-100">
                    <p className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wider">Base Prompt:</p>
                    <div className="prose prose-sm max-w-none text-gray-800">
                      <ReactMarkdown>{cleanMarkdownContent(basePromptContent)}</ReactMarkdown>
                    </div>
                  </div>
                )}
                {promptContent && (
                  <div>
                    {basePromptContent && <p className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wider">Specific Prompt:</p>}
                    <div className="prose prose-sm max-w-none text-gray-800">
                      <ReactMarkdown>{cleanMarkdownContent(promptContent)}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Raw AI Output Section */} 
          {markdownContent && (
            <div className="flex flex-col flex-grow overflow-hidden">
              <h4 className="text-lg font-medium mb-2 text-gray-600">Raw AI Output</h4>
              <div className="overflow-y-auto custom-scrollbar border border-gray-200 rounded p-4 bg-gray-50">
                <div className="prose max-w-none text-gray-800">
                  <ReactMarkdown>{cleanMarkdownContent(markdownContent)}</ReactMarkdown>
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