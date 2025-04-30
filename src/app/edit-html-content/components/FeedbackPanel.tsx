// FeedbackPanel.tsx
import React, { useEffect, useRef } from 'react'
import { formatDate } from '@/utils/formatDate'

interface Comment {
  createdOn: string
  createdBy: string
  comment: string
  fIleURL?: string
}

interface FeedbackPanelProps {
  comments: Comment[]
  isOpen: boolean
  onClose: () => void
  onDownloadFile: (fileUrl: string) => void
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  comments,
  isOpen,
  onClose,
  onDownloadFile
}) => {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Handle escape key to close the panel
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, onClose])

  // Prevent body scrolling when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-20">
      <div 
        ref={panelRef}
        className="w-full md:w-96 bg-white shadow-xl flex flex-col h-full transform transition-transform duration-300 ease-in-out"
        style={{ animation: 'slideIn 0.3s forwards' }}
      >
        {/* Header */}
        <div className="bg-[#00A881] text-white p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center space-x-2">
                <svg width="30" height="20" viewBox="0 0 43 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.625 17.5C2.5625 17.5 0.875 15.8125 0.875 13.75V4.375C0.875 2.3125 2.5625 0.625 4.625 0.625H19.625C21.6875 0.625 23.375 2.3125 23.375 4.375V13.75C23.375 15.8125 21.6875 17.5 19.625 17.5H15.875V23.125L10.25 17.5H4.625ZM38.375 28.75C40.4375 28.75 42.125 27.0625 42.125 25V15.625C42.125 13.5625 40.4375 11.875 38.375 11.875H27.125V13.75C27.125 17.875 23.75 21.25 19.625 21.25V25C19.625 27.0625 21.3125 28.75 23.375 28.75H27.125V34.375L32.75 28.75H38.375Z" fill="white" />
                </svg>
            <h2 className="font-semibold text-lg">Feedback</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            aria-label="Close feedback panel"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={comment.createdOn || index} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#00A881] bg-opacity-15 flex items-center justify-center">
                      <span className="text-[#00A881] font-semibold">
                        {comment.createdBy?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="ml-2">
                      <p className="font-medium text-gray-800">{comment.createdBy}</p>
                      <p className="text-xs text-gray-500">{formatDate(comment.createdOn)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-700">
                  {comment.comment}
                </div>
                
                {comment.fIleURL && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => onDownloadFile(comment.fIleURL || '')}
                      className="flex items-center gap-2 py-1.5 px-3 bg-[#00A881] hover:bg-[#00916f] text-white text-sm rounded transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16L12 8M12 16L9 13M12 16L15 13M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                          stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Download
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="mt-4 text-lg">No feedback yet</p>
              <p className="text-sm">Feedback will appear here when submitted</p>
            </div>
          )}
        </div>

        {/* Footer with action buttons */}
        {/* <div className="p-4 bg-white border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div> */}
      </div>

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default FeedbackPanel;