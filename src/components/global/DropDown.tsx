"use client"

import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import TextField from './TextField';

/**
 * DropDown Component
 *
 * A custom dropdown component that allows users to select an option from a provided list. 
 * The dropdown also includes an option to select "Other" and specify a custom input.
 * It closes automatically when clicking outside the dropdown container.
 *
 * @component
 * @param {DropDownProps} props - The component props.
 * @param {string} props.selectPlaceHolder - Placeholder text displayed when no option is selected.
 * @param {string} [props.customClass] - Optional custom CSS classes for styling the dropdown container.
 * @param {string} [props.dropdownWidthClass] - Optional CSS classes for controlling the dropdown width.
 * @param {Array.<{ label: string, value: string }>} props.optionLists - Array of options for the dropdown.
 *  Each option includes a label (display text) and a value to be selected.
 *
 * @returns {JSX.Element} A dropdown component with selectable options and an "Other" input field.
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
    const [selectedOption, setSelectedOption] = useState('')
    const [showOptionList, setShowOptionList] = useState(false)
    const [isOtherSelected, setIsOtherSelected] = useState(false)

    const dropdownRef = useRef<HTMLDivElement | null>(null)

    const handleDropDownList = () => {
        setShowOptionList((prev) => !prev)
    }

    const handleSelectList = (value: string) => {
        setSelectedOption(value)
        setShowOptionList(false)
        setIsOtherSelected(false)
    }

    const hanleOtherSelectedOption = (value: string) => {
        setIsOtherSelected(true)
        setShowOptionList(false)
        setSelectedOption(value)
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
        <div ref={dropdownRef} className={`relative flex flex-col gap-[7px] w-[260px] ${dropdownWidthClass}`}>
            <div onClick={handleDropDownList} className={`h-[60px] shadow-dropdown-shadow rounded-lg flex items-center justify-between px-4 py-5 cursor-pointer ${customClass}`}>
                <p className={`text-base ${!selectedOption ? "text-[#666666]" : ""}`}>{selectedOption || selectPlaceHolder}</p>
                <span className={`cursor-pointer transition-transform ${showOptionList ? "rotate-180" : ""}`}><MdOutlineKeyboardArrowDown size={25} /></span>
            </div>
            <div className={`w-[260px] top-[70px] z-50 h-auto bg-white flex flex-col shadow-dropdown-shadow rounded-lg transition-all absolute duration-300 ease-in-out overflow-hidden ${showOptionList ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'} ${dropdownWidthClass}`}>
                {showOptionList &&
                    <>
                        {optionLists.map((options, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelectList(options.value)}
                                className='h-11 px-4 py-3 flex items-center text-base cursor-pointer'
                            >
                                {options.label}
                            </div>
                        ))}
                        <div onClick={() => hanleOtherSelectedOption("Other")} className='h-11 px-4 py-3 flex items-center text-base cursor-pointer'>Other</div>
                    </>
                }
            </div>
            {isOtherSelected &&
                <TextField customClass='h-11' customAreaClass="whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide" placeholder='Specify other target audiences' />
            }
        </div>
    )
}

export default DropDown
