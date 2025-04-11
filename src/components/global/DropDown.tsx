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
 * @param {(valueSelected: DropDownOptions) => void} props.onSelected - Select value
 *  Each option includes a label (display text) and a value to be selected.
 *
 * @returns {JSX.Element} A dropdown component with selectable options and an "Other" input field.
 */


export interface DropDownOptions {
    label: string;
    value: string;
}

interface DropDownProps {
    selectPlaceHolder: string;
    customClass?: string;
    dropdownWidthClass?: string;
    optionLists: DropDownOptions[];
    isShowOther?: boolean;
    otherFieldText ?: string 
    otherFieldErrorText ?: string
    preSelectValue ?: string
    onSelected?: (valueSelected: DropDownOptions) => void;
}

const DropDown: React.FC<DropDownProps> = ({
    optionLists,
    selectPlaceHolder,
    customClass = "",
    dropdownWidthClass = "",
    otherFieldText = 'Specify other target audiences',
    otherFieldErrorText = '',
    preSelectValue,
    onSelected = () => { },
    isShowOther = true  }) => {
    const [selectedOption, setSelectedOption] = useState('')
    const [showOptionList, setShowOptionList] = useState(false)
    const [isOtherSelected, setIsOtherSelected] = useState(false)

    const dropdownRef = useRef<HTMLDivElement | null>(null)
    
    useEffect(()=>{
        setSelectedOption(preSelectValue||'')
    },[preSelectValue])

    const handleDropDownList = () => {
        setShowOptionList((prev) => !prev)
    }

    const handleSelectList = (options: DropDownOptions) => {
        setSelectedOption(options.value)
        setShowOptionList(false)
        setIsOtherSelected(false)
        onSelected(options)
    }

    const hanleOtherSelectedOption = (value: string) => {
        setIsOtherSelected(true)
        setShowOptionList(false)
        setSelectedOption(value)
        onSelected({ value: '', label: "Other" }) 
    }

    const onChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const options = {
            value: e.target.value,
            label: 'Other'
        }
        onSelected(options)
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
        <div ref={dropdownRef} className={`relative flex flex-col gap-[7px] ${dropdownWidthClass}`}>
            <div onClick={handleDropDownList} className={`h-[60px] bg-white shadow-dropdown-shadow rounded-lg flex items-center justify-between px-4 py-5 cursor-pointer ${customClass}`}>
                <p className={`text-base ${!selectedOption ? "text-[#666666]" : ""}`}>{selectedOption || selectPlaceHolder}</p>
                <span className={`cursor-pointer transition-transform ${showOptionList ? "rotate-180" : ""}`}><MdOutlineKeyboardArrowDown size={25} /></span>
            </div>
            <div className={`z-[40] h-auto bg-white flex flex-col shadow-dropdown-shadow rounded-lg transition-all relative duration-300 ease-in-out ${showOptionList ? 'max-h-[185px] overflow-y-scroll opacity-100' : 'max-h-0 opacity-0'} ${dropdownWidthClass}`}>
                {showOptionList &&
                    <>
                        {optionLists.map((options, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelectList(options)}
                                className='h-11 px-4 py-3 flex items-center text-base cursor-pointer hover:bg-[#e6f7f4] hover:text-[#0a8c78] hover:rounded-lg my-[2px] duration-200'
                            >
                                {options.label}
                            </div>
                        ))}
                        {isShowOther ? <div onClick={() => hanleOtherSelectedOption("Other")} className='h-11 px-4 py-3 flex items-center text-base cursor-pointer'>Other</div> : null}
                    </>
                }
            </div>
            {isOtherSelected &&
                <TextField handleChange={onChangeText} customClass='h-11' customAreaClass="whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide" placeholder={otherFieldText} />
            }
            {otherFieldErrorText.length>0 && <p className='text-red-500 text-[12px] mt-[5px]'>{otherFieldErrorText}</p>}
        </div>
    )
}

export default DropDown
