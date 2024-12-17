import React, { ReactNode, useEffect, useRef } from 'react'
import { ExpressIcon } from '@/assets/icons/AppIcons';

interface ProjectSetUpModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onNext?: () => void;
    selectedValue?: string;
    children: ReactNode;
}

const ProjectSetUpModal: React.FC<ProjectSetUpModalProps> = ({ children, title, isOpen, onClose, onNext, selectedValue = "" }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Close modal if clicking outside of it
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
                document.body.style.overflow = '';
            }
        };

        // Add event listener when the modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
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
                    <div className='flex items-center gap-5'>
                        {selectedValue === "All in One" && <ExpressIcon /> }
                        <p className='text-xl font-semibold tracking-wide'>{title}</p>
                    </div>
                    <div onClick={onNext} className='flex items-center gap-[10px] cursor-pointer'>
                        <p className='text-xl font-medium tracking-wide text-green-300'>Next</p>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                <path d="M12.9574 7.22448L8.09238 2.14487L9.95514 0.199951L17.069 7.62749L18.0003 8.59995L17.069 9.57241L9.95514 17L8.09238 15.055L12.9574 9.97542H0.329102V7.22448H12.9574Z" fill="#01A982" />
                            </svg>
                        </span>
                    </div>
                </div>
                <>
                    {children}
                </>
            </div>
        </div>
    )
}

export default ProjectSetUpModal