import React, { FC } from 'react'
import { FiTrash2 } from "react-icons/fi";

interface ConfirmationModalProps {
  message?: string;
  isOpen?: boolean;
  isCancel: () => void;
  isConfirm: () => void
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({ isOpen , message = "", isCancel, isConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center bg-[rgba(5,5,5,0.8)] z-[1000]'>
      <div className='bg-white rounded-xl px-8 py-6 shadow-md text-center max-w-[400px] w-[90%]'>
        <div className='flex items-center justify-center w-full'>
          <FiTrash2 className='text-red-600 text-center text-5xl mb-6' />
        </div>
        <div className='text-base mb-6'>
          {message}
        </div>
        <div className='flex items-center justify-between gap-5'>
          <button onClick={isConfirm} className='flex-1 px-6 py-2 rounded-md cursor-pointer bg-red-500 text-white'>Confirm</button>
          <button onClick={isCancel} className='flex-1 px-6 py-2 rounded-md cursor-pointer bg-transparent border border-[#a5a5a5]'>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal