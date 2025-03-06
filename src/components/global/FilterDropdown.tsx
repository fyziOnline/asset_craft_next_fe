import React, { FC, useEffect, useRef, useState } from 'react'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

export interface DropDownOptions {
    label: string;
    value: string;
}

interface FilterDropdownProps {
    customClass?: string;
    optionLists: DropDownOptions[];
    selectedValueClass ?: string
    topLevelClass ?: string
    optionsListClass ?: string
    placeholder?: string
    selectedValue?: (value: string) => void
    defaultSelectedOption ?:string
    defaultSelectedLabel ?:string
    allowDrop ?: boolean
}

const FilterDropdown: FC<FilterDropdownProps> = ({ customClass, topLevelClass,selectedValueClass,optionsListClass, optionLists, placeholder = 'Select', selectedValue, defaultSelectedOption = "",defaultSelectedLabel="",allowDrop=true }) => {
    const [showOptionList, setShowOptionList] = useState(false)
    const [selectedOption, setSelectedOption] = useState(defaultSelectedOption)
    const [selectedLabel, setSelectedLabel] = useState(defaultSelectedLabel)

    const dropdownRef = useRef<HTMLDivElement | null>(null)

    const handleDropDownList = () => {
        if (allowDrop) {
            setShowOptionList((prev) => !prev)
        }
    }

    const handleSelectList = (options: DropDownOptions) => {
        setSelectedOption(options.value)
        setSelectedLabel(options.label)
        setShowOptionList(false)
        selectedValue && selectedValue(options.value)
    }

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowOptionList(false)
            }
        }
        document.addEventListener('mousedown', handleOutsideClick)
        return () => {
            document.removeEventListener('mousedown', handleDropDownList)
        }
    }, [])
    return (
        <div ref={dropdownRef} className={`relative ${topLevelClass}`}>
            <div onClick={handleDropDownList} className={`flex items-center justify-between gap-2 rounded-full w-[200px] border border-[rgba(217,217,217,0.93)] px-3 py-1 cursor-pointer ${customClass}`} >
                <p className={`text-base tracking-wide ${!selectedOption ? "text-[#666666]" : ""} ${selectedValueClass}`}>{selectedLabel || placeholder}</p>
                <span className={`cursor-pointer transition-transform ${showOptionList ? "rotate-180" : ""}`}><MdOutlineKeyboardArrowDown color={allowDrop ? `#00A881` : '#808080'} size={25} /></span>
            </div>
            {showOptionList &&
                <div className={`z-40 bg-[#F6F6F6] border border-[rgba(217,217,217,0.93)] py-2 mt-2 absolute h-auto w-[200px] flex flex-col shadow-dropdown-shadow rounded-2xl transition-all duration-300 ease-in-out ${optionsListClass}`} >
                    {optionLists.map((options, index) => (
                        <div key={index} onClick={() => handleSelectList(options)} className='h-4 px-3 py-4 flex items-center text-base cursor-pointer'>{options.label}</div>
                    ))}
                </div>
            }
        </div>
    )
}

export default FilterDropdown