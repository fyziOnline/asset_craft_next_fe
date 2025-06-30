"use client";

import React, { useEffect, useRef, useState } from 'react'
import { formatDateTime } from '@/utils/formatDate'
import { GrAttachment } from "react-icons/gr";
import { LuSend } from "react-icons/lu";
import { GrDownload } from "react-icons/gr";
import { IoClose } from "react-icons/io5";
import { useAssetApproval } from '@/hooks/useAssetApproval';
import { useEditAssetStoreSelector } from '@/store/editAssetStore';
import { AssetVersionProps } from '@/types/templates';

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
  getApprovalDetails?: () => void
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  comments,
  isOpen,
  onClose,
  onDownloadFile,
  getApprovalDetails
}) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const versionList = useEditAssetStoreSelector.use.versionList()
  const selectedVersionID = useEditAssetStoreSelector.use.selectedVersionID()

  const versionSelected = versionList.find(v => v.assetVersionID === selectedVersionID) as AssetVersionProps

  const { handleUploadFile, eventInputComment, reAssignAsset, canReassign, reAssignLoading, reAssignAssetDetails, setCanReassign } = useAssetApproval(
    {
      assetVersionID: versionSelected?.assetVersionID || "",
      assetID: versionSelected?.assetID || "",
      versionStatus: versionSelected?.status || ""
    }
  )

  const [isFIleSelected, setIsFIleSelected] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const feedbackInputRef = useRef<HTMLInputElement>(null);


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

  function extractFileName(url: string): string | null {
    const lastSegment = url.split('/').pop();
    if (!lastSegment) return null;

    const underscoreIndex = lastSegment.indexOf('_');
    if (underscoreIndex === -1 || underscoreIndex === lastSegment.length - 1) {
      return null;
    }

    return lastSegment.substring(underscoreIndex + 1);
  }

  // Group consecutive messages from the same person
  const groupedComments = comments.reduce((groups: Comment[][], comment, index) => {
    if (index === 0 || comments[index - 1].createdBy !== comment.createdBy) {
      // Start a new group
      groups.push([comment]);
    } else {
      // Add to the current group
      groups[groups.length - 1].push(comment);
    }
    return groups;
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsFIleSelected(true);
      setFile(file);
      handleUploadFile(file);
    }
  };

  const handleSendFeedback = async () => {
    try {
      await reAssignAsset();
      if (getApprovalDetails) {
        getApprovalDetails()
      }

      if (feedbackInputRef.current) {
        feedbackInputRef.current.value = "";
      }
      setIsFIleSelected(false);
      setFile(null);
      setCanReassign(false)
      console.log("reAssignAssetDetails", reAssignAssetDetails);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-20">
      <div
        ref={panelRef}
        className="w-full md:w-[30%] bg-white shadow-xl flex flex-col h-full transform transition-transform duration-300 ease-in-out"
        style={{ animation: 'slideIn 0.3s forwards' }}
      >
        {/* Header */}
        <div className="bg-[#00A881] text-white p-4 flex justify-between items-center flex-shrink-0">
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

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ height: 'calc(100vh - 200px)' }}>
          {groupedComments && groupedComments.length > 0 ? (
            groupedComments.map((group, groupIndex) => (
              <div key={groupIndex} className="bg-white rounded-lg shadow p-4">
                {/* User profile header (shown once per group) */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#00A881] bg-opacity-15 flex items-center justify-center">
                      <span className="text-[#00A881] font-semibold">
                        {group[0].createdBy?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="ml-2">
                      <p className="font-medium text-gray-800">{group[0].createdBy}</p>
                      <p className="text-xs text-gray-500">{formatDateTime(group[0].createdOn)}</p>
                    </div>
                  </div>
                </div>

                {/* Messages in the group */}
                <div className="space-y-3">
                  {group.map((comment, commentIndex) => (
                    <div key={comment.createdOn || `${groupIndex}-${commentIndex}`}>
                      {/* Message content */}
                      <div className="mb-2">
                        <div className="text-gray-800">
                          {comment.comment}
                        </div>
                        {commentIndex < group.length - 1 && (
                          <div className="text-xs text-gray-400 mt-1">
                            {formatDateTime(comment.createdOn)}
                          </div>
                        )}
                      </div>

                      {/* File attachment if present */}
                      {comment.fIleURL && (
                        <div className='bg-[#00A881] bg-opacity-15 p-3 flex flex-wrap justify-between text-center mb-2 rounded-lg'>
                          <p className="max-w-[85%] break-words whitespace-normal text-[#00A881] text-sm">
                            {extractFileName(comment.fIleURL)}
                          </p>
                          <GrDownload
                            onClick={() => onDownloadFile(comment.fIleURL || '')}
                            cursor={'pointer'}
                            color='#00A881'
                            size={18}
                            style={{ fontWeight: 'bolder' }}
                          />
                        </div>
                      )}

                      {/* Separator line between messages in the same group (except for the last message) */}
                      {commentIndex < group.length - 1 && (
                        <hr className="border-gray-200 my-3" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-4 text-lg">No feedback yet</p>
              <p className="text-sm">Feedback will appear here when submitted</p>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200 flex items-center gap-4" style={{ marginBottom: '60px' }}>
          <>
            <GrAttachment
              color={isFIleSelected ? '#00A881' : '#9ca3af'}
              size={25}
              cursor="pointer"
              onClick={() => fileInputRef.current?.click()}
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </>

          <div className='w-full relative'>
            <input
              type="text"
              ref={feedbackInputRef}
              onChange={eventInputComment}
              className="w-full h-12 px-4 py-3 text-sm text-gray-800 bg-white rounded-xl border border-gray-300 focus:outline-none focus:border-[#00A881] focus:ring-1 focus:ring-[#00A881]"
              placeholder="Type your feedback here"
            />
            {
              file && (
                <div className='absolute left-0 -bottom-6 text-[12px] text-gray-400 flex items-center gap-1'>
                  {file?.name}
                  <IoClose size={18}
                    color='red'
                    cursor={'pointer'}
                    onClick={() => {
                      setFile(null);
                      setIsFIleSelected(false);
                    }}
                  />
                </div>
              )
            }
          </div>
          <div className='bg-[#e5e7eb] rounded-full w-12 h-10 flex items-center justify-center cursor-pointer'>
            <button disabled={!canReassign || reAssignLoading}>
              <LuSend
                size={18}
                color={canReassign ? '#00A881' : '#9ca3af'}
                onClick={handleSendFeedback}
              />
            </button>
          </div>
        </div>
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