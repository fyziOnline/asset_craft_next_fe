"use client"

import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'

/**
 * DropDown Component
 *
 * A custom dropdown component built using React. 
 * It allows users to select an option from a provided list.
 * The dropdown closes when clicking outside its container.
 *
 * @component
 * @param {object} props - The component props.
 * @param {string} props.selectPlaceHolder - Placeholder text displayed when no option is selected.
 * @param {string} [props.customClass] - Optional custom CSS classes for styling the dropdown.
 * @param {string} [props.dropdownWidthClass] - Optional CSS classes for controlling dropdown width.
 * @param {Array.<{ label: string, value: string }>} props.optionLists - Array of options for the dropdown.
 * Each option includes a label (display text) and a value.
 *
 *
 * @returns {JSX.Element} A dropdown component with selectable options.
 */


interface options {
    label: string;
    value: string;
}

interface DropDownProps {
    selectPlaceHolder: string;
    customClass?: string;
    dropdownWidthClass?: string;
    optionLists: options[];
}

const DropDown: React.FC<DropDownProps> = ({ optionLists, selectPlaceHolder, customClass = "", dropdownWidthClass = "" }) => {
    const [showOptionList, setShowOptionList] = useState(false)
    const [selectedOption, setSelectedOption] = useState('')

    const dropdownRef = useRef<HTMLDivElement | null>(null)

    const handleDropDownList = () => {
        setShowOptionList((prev) => !prev)
    }

    const handleSelectList = (value: string) => {
        setSelectedOption(value)
        setShowOptionList(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowOptionList(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div ref={dropdownRef} className={`flex flex-col gap-2 relative w-[260px] ${dropdownWidthClass}`}>
            <div onClick={handleDropDownList} className={`h-16 shadow-md rounded-lg flex items-center justify-between px-4 cursor-pointer ${customClass}`}>
                <p className={`text-base ${!selectedOption ? "text-[#666666]" : ""}`}>{selectedOption || selectPlaceHolder}</p>
                <span className={`cursor-pointer transition-transform ${showOptionList ? "rotate-180" : "" }`}><MdOutlineKeyboardArrowDown size={25} /></span>
            </div>
            <div className={`w-[260px] z-50 h-auto absolute bg-white top-20 flex flex-col shadow-md rounded-lg px-4 transition-all duration-300 ease-in-out overflow-hidden ${showOptionList ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'} ${dropdownWidthClass}`}>
                {showOptionList && 
                    optionLists.map((options, index) => (
                        <div 
                            key={index} 
                            onClick={() => handleSelectList(options.value)} 
                            className='h-11 flex items-center text-base cursor-pointer'
                        >
                            {options.label}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default DropDown
