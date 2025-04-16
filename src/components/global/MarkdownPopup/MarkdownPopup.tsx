import { FC, useEffect, useRef, useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import ReactMarkdown from 'react-markdown'
import { GlobalEdit } from '@/assets/icons/AppIcons';
import { ApiService } from '@/lib/axios_generic';
import { urls } from '@/apis/urls';

interface MarkdownPopupProps {
  markdownContent: string
  promptContent: string
  basePromptContent?: string
  isOpen: boolean

  onClose: () => void
}

const MarkdownPopup: FC<MarkdownPopupProps> = ({ markdownContent, promptContent, basePromptContent, isOpen, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedBasePrompt, setEditedBasePrompt] = useState(basePromptContent || '')
  const [savedBasePrompt, setSavedBasePrompt] = useState(basePromptContent || '')
  const [editedSpecificPrompt, setEditedSpecificPrompt] = useState(promptContent || '')
  const [savedSpecificPrompt, setSavedSpecificPrompt] = useState(promptContent || '')


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

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false)
    } else {
      setSavedBasePrompt(basePromptContent || '')
      setEditedBasePrompt(basePromptContent || '')

      setSavedSpecificPrompt(promptContent || '')
      setEditedSpecificPrompt(promptContent || '')
    }
  }, [isOpen, basePromptContent, promptContent])


  const handleEditClick = () => {
    setIsEditing(true)
    setEditedBasePrompt(savedBasePrompt)
  }

  const handleSaveClick = async () => {
    const trimmedPrompt = editedBasePrompt.trim();
  
    try {

      const response = await ApiService.put<any>(urls.base_rawai_prompt, {
        baseRawPrompt: trimmedPrompt
      });
  
      if (response.isSuccess) {
        setSavedBasePrompt(trimmedPrompt);
        setSavedSpecificPrompt(editedSpecificPrompt.trim());
        setIsEditing(false);

        console.log('base_rawai_prompturl', urls.base_rawai_prompt);
        console.log('response', response);
        console.log('Edited baseRawPrompt submitted:', trimmedPrompt);
      } else {
        alert(`Save failed: ${response.errorOnFailure || 'Please try again later.'}`);
      }
    } catch (error) {
      console.error('API Error:', ApiService.handleError(error));
      alert(ApiService.handleError(error));
    } finally {
     
    }
  };
  
  // const handleSaveClick = () => {
  //   setSavedBasePrompt(editedBasePrompt.trim())
  //   setSavedSpecificPrompt(editedSpecificPrompt.trim())
  //   setIsEditing(false)
  // }


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
              <div className='flex flex-row mb-1 mt-2 items-center justify-between'>
                <h4 className="text-lg font-medium text-gray-600">AI Request</h4>

                <div
                  onClick={handleEditClick}
                  className='p-1 cursor-pointer flex flex-row text-[14px] font-bold bg-custom-gradient-green rounded-[30px] px-3 py-1 '>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 30 30" fill="none">
                    <path d="M21.459 2.79243C22.2215 2.02993 23.2557 1.60156 24.334 1.60156C25.4123 1.60156 26.4465 2.02993 27.209 2.79243C27.9715 3.55492 28.3998 4.58909 28.3998 5.66743C28.3998 6.74576 27.9715 7.77993 27.209 8.54243L9.00065 26.7508L1.33398 28.6674L3.25065 21.0008L21.459 2.79243Z" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className='ml-1 text-white'>Edit</div>
                </div>
              </div>

              <div className="overflow-y-auto custom-scrollbar max-h-[25vh] border border-blue-200 rounded p-4 bg-blue-50">
                {(basePromptContent || isEditing) && (
                  <div className="border-b border-blue-100">
                    <p className="text-xs font-semibold text-blue-700  uppercase tracking-wider">
                      Base Prompt:
                    </p>
                    {isEditing ? (
                      <textarea
                        value={editedBasePrompt}
                        onChange={(e) => setEditedBasePrompt(e.target.value)}
                        className="w-full p-2 outline-none border-none bg-white rounded-md resize-none scrollbar-hide"
                      />
                    ) : (
                      <div className="prose prose-sm max-w-none text-gray-800">
                        <ReactMarkdown>
                          {editedBasePrompt.trim() !== '' && editedBasePrompt !== basePromptContent
                            ? editedBasePrompt
                            : basePromptContent || ''}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}

                {/* {promptContent && (
                  <div className='mt-6'>
                    {basePromptContent && <p className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wider">Specific Prompt:</p>}
                    {isEditing ? (
                      <textarea
                        value={editedSpecificPrompt}
                        onChange={(e) => setEditedSpecificPrompt(e.target.value)}
                        className="w-full p-2 outline-none border-none bg-white rounded-md resize-none scrollbar-hide"
                      />
                    ) : (
                      <div className="prose prose-sm max-w-none text-gray-800">
                        <ReactMarkdown>
                          {editedSpecificPrompt.trim() !== '' && editedSpecificPrompt !== promptContent
                            ? editedSpecificPrompt
                            : promptContent || ''}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                )} */}

              </div>

              <div className="overflow-y-auto custom-scrollbar max-h-[25vh] border border-blue-200 rounded p-4 mt-2 bg-blue-50">
                {promptContent && (
                  <div>
                    {basePromptContent && <p className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wider">Specific Prompt:</p>}
                    <div className="prose prose-sm max-w-none text-gray-800">
                      <ReactMarkdown>{promptContent}</ReactMarkdown>
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
                  <ReactMarkdown>{markdownContent}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
        {isEditing && (
          <div className="flex justify-end gap-4 mt-4">
            {/* <div className="p-4 flex justify-end">{submitbutton}</div> */}
            <button
              onClick={handleSaveClick}
              className="bg-green-300 text-white px-8 py-1 rounded-full font-medium">
              Submit
            </button>

            <button
              onClick={() => {
                setEditedBasePrompt(savedBasePrompt)
                setEditedSpecificPrompt(savedSpecificPrompt)
                setIsEditing(false) // Exit edit mode
              }}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-full transition-colors duration-200"
            >
              Cancel
            </button>

          </div>
        )}
      </div>
    </div>
  )
}

export default MarkdownPopup 




