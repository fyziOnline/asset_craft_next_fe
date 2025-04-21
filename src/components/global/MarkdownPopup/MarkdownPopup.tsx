import { FC, useEffect, useRef, useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import ReactMarkdown from 'react-markdown'
import { ApiService } from '@/lib/axios_generic';
import { urls } from '@/apis/urls';
import { ChevronDown, ChevronRight, Edit3 } from 'lucide-react';

const cleanMarkdownContent = (content: string): string => {
  // Remove ```markdown ... ``` wrapper if present, handling variations
  const trimmed = content.trim();
  // Regex explanation:
  // ^```markdown: Starts with ```markdown
  // [\s\S]*?: Followed by any characters (including newlines), non-greedy
  // ```$: Ends with ```
  const markdownBlockRegex = /^```markdown[\s\S]*?```$/;
  if (markdownBlockRegex.test(trimmed)) {
    // Extract content between the tags
    const cleaned = trimmed.replace(/^```markdown\s*|\s*```$/g, '').trim();
    return cleaned;
  }
  return trimmed;
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
  const [isEditing, setIsEditing] = useState(false)
  const [editedBasePrompt, setEditedBasePrompt] = useState(basePromptContent || '')
  const [savedBasePrompt, setSavedBasePrompt] = useState(basePromptContent || '')
  const [isRequestExpanded, setIsRequestExpanded] = useState(false);

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
      setIsRequestExpanded(false)
    } else {
      setSavedBasePrompt(basePromptContent || '')
      setEditedBasePrompt(basePromptContent || '')
    }
  }, [isOpen, basePromptContent])

  const handleEditClick = () => {
    setIsEditing(true)
    setIsRequestExpanded(true)
  }

  const handleCancelClick = () => {
    setEditedBasePrompt(savedBasePrompt)
    setIsEditing(false)
  }

  const handleSaveClick = async () => {
    const trimmedPrompt = editedBasePrompt.trim();

    try {
      // Using unknown is safer than any
      type ApiResponse = { message?: string; [key: string]: unknown };
      const response = await ApiService.put<ApiResponse>(urls.base_rawai_prompt, {
        baseRawPrompt: trimmedPrompt
      });

      if (response.isSuccess) {
        setSavedBasePrompt(trimmedPrompt);
        setIsEditing(false);
      } else {
        alert(`Save failed: ${response.errorOnFailure || 'An unknown error occurred. Please try again later.'}`);
      }
    } catch (error) {
      alert(`An error occurred while saving: ${ApiService.handleError(error)}`);
    }
  };

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
          {/* Collapsible AI Request Section */}
          {(basePromptContent || promptContent) && (
            <div className="border border-blue-200 rounded">
              <button
                onClick={() => setIsRequestExpanded(!isRequestExpanded)}
                className="flex justify-between items-center w-full p-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-t"
                aria-expanded={isRequestExpanded}
              >
                <h4 className="text-lg font-medium text-gray-600">AI Request</h4>
                {isRequestExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>

              {isRequestExpanded && (
                <div className="p-4 border-t border-gray-200 bg-blue-50/50">
                  {/* Base Prompt Section */}
                  <div className="overflow-y-auto custom-scrollbar max-h-[40vh]">
                    {(basePromptContent || isEditing) && (
                      <div className="border-b border-blue-100 pb-3 mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                            Base Prompt:
                          </p>
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                               <button
                                 onClick={handleSaveClick}
                                 className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full font-medium transition-colors">
                                 Save
                               </button>
                               <button
                                 onClick={handleCancelClick}
                                 className="text-xs text-gray-600 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                               >
                                 Cancel
                               </button>
                            </div>
                          ) : (
                            <button
                              onClick={handleEditClick}
                              className='text-xs cursor-pointer flex items-center text-blue-600 hover:text-blue-800 font-medium'
                            >
                              <Edit3 size={14} className="mr-1" />
                               Edit
                             </button>
                          )}
                        </div>
                        {isEditing ? (
                          <textarea
                            value={editedBasePrompt}
                            onChange={(e) => setEditedBasePrompt(e.target.value)}
                            className="w-full p-2 outline-none border border-blue-300 bg-white rounded-md resize-y scrollbar-hide text-sm text-gray-800"
                            rows={6}
                          />
                        ) : (
                          <div className="prose prose-sm max-w-none text-gray-800">
                            <ReactMarkdown>
                              {cleanMarkdownContent(savedBasePrompt)}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Specific Prompt Section (Non-Editable) */}
                     {promptContent && (
                      <div>
                        <p className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wider">Specific Prompt:</p>
                        <div className="prose prose-sm max-w-none text-gray-800">
                          <ReactMarkdown>{cleanMarkdownContent(promptContent)}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Raw AI Output Section */}
          {markdownContent && (
            <div className="flex flex-col flex-grow overflow-hidden">
              <h4 className="text-lg font-medium mb-2 text-gray-600">Raw AI Output</h4>
              <div className="overflow-y-auto custom-scrollbar border border-gray-200 rounded p-4 bg-gray-50 flex-grow">
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




