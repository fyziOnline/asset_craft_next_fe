'use client'
import { Dispatch, FC, SetStateAction, useCallback, useRef } from 'react'

interface BaseToggleAsideProps {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    children?: React.ReactNode
    asideRef?: React.RefObject<HTMLDivElement>
    toggleButtonPosition?: 'top' | 'middle'
    width?: string
    height?: string
    backgroundColor?: string
    toggleButtonColor?: string
    toggleButtonSize?: {
        width: string
        height: string
    }
}

const BaseToggleAside: FC<BaseToggleAsideProps> = ({
    isOpen,
    setIsOpen,
    children,
    asideRef: externalRef,
    toggleButtonPosition = 'middle',
    width = '40vw',
    height = '70vh',
    backgroundColor = '#F5F5F7',
    toggleButtonColor = '#00b188',
    toggleButtonSize = { width: '25px', height: '56px' }
}) => {
    const internalRef = useRef<HTMLDivElement>(null)
    const ref = externalRef || internalRef
    
    // Toggle sidebar open/close state
    const toggleAside = useCallback(() => {
        setIsOpen(prev => !prev)
    }, [setIsOpen])

    // Calculate position for toggle button
    const getButtonPositionStyle = () => {
        if (toggleButtonPosition === 'top') {
            return { top: '10px' }
        }
        return { top: '50%', transform: 'translateY(-50%)' }
    }

    return (
        <div className={`absolute top-4 right-0 h-[70vh] ${isOpen ? 'min-w-[40vw] ' : 'w-[0px]'}`}>
            <div 
                ref={ref} 
                className={`bg-[#F5F5F7] pb-28 overflow-y-scroll flex items-center justify-center transition-all duration-300 ease-in-out absolute ${isOpen ? 'w-full' : 'w-[0px]'}`}
                style={{ zIndex: 10 }} // Sidebar stays above content
            >
                {isOpen && (
                    children
                )}
            </div>
            {/* Toggle button */}
            <div
                onClick={toggleAside}
                className={`absolute top-10 transform -translate-y-1/2 flex items-center w-[25px] h-14 gap-2.5 px-2 py-[18px] bg-[#00b188] rounded-[10px_0px_0px_10px] cursor-pointer transition-all duration-300 border-t-2 border-l-2 border-b-2`}
                style={{ right: isOpen ? '100%' : '0px', zIndex: 20 }}
            >
                <svg
                    width="8"
                    height="16"
                    viewBox="0 0 8 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
                >
                    <path
                        d="M1.5 1L6.5 6L1.5 11"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    )
}

export default BaseToggleAside