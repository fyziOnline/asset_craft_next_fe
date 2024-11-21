import React, { useEffect, useRef } from 'react'
import TextField from '../global/TextField'

interface ProjectSetUpModalProps {
    isOpen: boolean;
    onClose: () => void,
    onNext?: () => void
}

const ProjectSetUpModal: React.FC<ProjectSetUpModalProps> = ({ isOpen, onClose, onNext }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Close modal if clicking outside of it
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        // Add event listener when the modal is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            // Remove event listener when the modal is closed or component is unmounted
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className='w-full h-screen flex items-center justify-center fixed top-0 bottom-0 left-0 right-0 bg-black-translucent'>
            <div ref={modalRef} className='bg-white w-1/2 h-auto rounded-3xl'>
                <div className='flex items-center justify-between px-12 pt-5 py-3 border-b-[1px] border-[#EBEFF2]'>
                    <p className='text-xl font-semibold tracking-wide'>Project Details</p>
                    <div onClick={onNext} className='flex items-center gap-[10px] cursor-pointer'>
                        <p className='text-xl font-medium tracking-wide text-green-300'>Next</p>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                <path d="M12.9574 7.22448L8.09238 2.14487L9.95514 0.199951L17.069 7.62749L18.0003 8.59995L17.069 9.57241L9.95514 17L8.09238 15.055L12.9574 9.97542H0.329102V7.22448H12.9574Z" fill="#01A982" />
                            </svg>
                        </span>
                    </div>
                </div>
                <div className='w-full flex flex-col gap-3 px-12 pb-7'>
                    <div className='pt-[15px] flex flex-col gap-3'>
                        <p className='text-[#160647] text-base tracking-wide font-semibold'>Project/Solution Name</p>
                        <TextField customClass='h-12' placeholder='Type the name of your Project/Solution here.' />
                    </div>
                    <div className='flex flex-col gap-3'>
                        <p className='text-[#160647] text-base tracking-wide font-semibold'>Campaign Name</p>
                        <TextField customClass='h-12' placeholder='Type the name of your Campaign here.' />
                    </div>
                    <div className='flex flex-col gap-3'>
                        <p className='text-[#160647] text-base tracking-wide font-semibold'>Digital Marketing Asset Name</p>
                        <TextField customClass='h-12' placeholder='Type the name of your Digital Marketing Assets here.' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectSetUpModal