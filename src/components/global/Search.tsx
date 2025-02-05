"use client"

import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import SearchIcon from '@/assets/icons/SearchIcon'
import { SearchDownArrow } from '@/assets/icons/DownArrow'

/**
 * Search component for filtering and selecting a person from a list of options.
 *
 * @param {Object} props - The properties passed to the Search component.
 * @param {string} [props.placeHolder="Search for a person..."] - The placeholder text for the search input field.
 * @param {Option[]} [props.optionsList=[]] - The list of options to search through.
 * @param {string} [props.customOuterClass=""] - Custom outer class to apply to the component.
 * @param {Function} [props.onSelect] - Callback to execute when a person is selected.
 *
 * @returns {React.FC} The Search component.
 */

export interface Option {
    label: string
    value: string
    firstLetter: string
    IconColor?: string
}

interface SearchProps {
    optionsList?: Option[];
    placeHolder?: string;
    customOuterClass?: string;
    onSelect?: (selectedOption: Option) => void;
}


const Search: React.FC<SearchProps> = ({
    optionsList = [],
    onSelect,
    placeHolder = "Search for a person...",
    customOuterClass = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectValue, setSelectValue] = useState<Option | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const searchRef = useRef<HTMLDivElement | null>(null);

    /**
     * Filters the options list based on the current search query
     * Matches against both label and value properties
     * @returns {Option[]} Filtered list of options
     */
    const getFilteredOptions = useCallback(() => {
        const query = searchQuery.toLowerCase()
        return optionsList.filter(option =>
            option.label.toLowerCase().includes(query) ||
            option.value.toLowerCase().includes(query)
        )
    }, [optionsList, searchQuery])

    // Toggles the open/close state of the dropdown.
    const handleToggle = useCallback(() => {
        setIsOpen(prev => !prev)
    }, [])

    /**
     * Handles the selection of an option from the dropdown
     * Updates the selected value, closes the dropdown, and triggers the onSelect callback
     * @param {Option} option - The selected option
     */
    const handleOptionSelect = useCallback((option: Option) => {
        setSelectValue(option)
        setIsOpen(false)
        setSearchQuery("")
        onSelect?.(option)
    }, [onSelect])

    /**
     * Handles changes to the search input value
     * @param {ChangeEvent<HTMLInputElement>} e - The input change event
     */
    const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }, [])

    // Closes the dropdown if a click occurs outside the search component.
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={searchRef} className={`relative flex flex-col w-[300px] ${customOuterClass} border-sectionGrey-darker border-solid border-[1px] rounded-full p-2`}>
            <div onClick={handleToggle} className={`flex items-center gap-1 bg-white px-2 cursor-pointer ${isOpen ? "rounded-t-[16px] " : "rounded-full"}`}>
                <SearchIcon customColor='#00A881' />
                {selectValue?.label ?
                    <div className='flex items-start px-1 w-full '>
                        <div className='flex items-center gap-[10px]  rounded-full p-[5px]' >
                            <div className='flex items-center justify-center w-5 h-5 rounded-full bg-[#D2D2D2] text-white'>
                                <span className='text-sm'>{selectValue.firstLetter}</span>
                            </div>
                            <p className='text-sm'>{selectValue.label}</p>
                        </div>
                    </div>
                    :
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder={placeHolder}
                        className='bg-white border-none outline-none w-full h-full px-1 placeholder-[#6F6F6F]'
                    />
                }
                <span className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}><SearchDownArrow /></span>
            </div>
            {isOpen &&
                <div className='absolute top-12 left-0 right-0 flex flex-col bg-white  max-h-60 overflow-y-auto shadow-search-box-shadow'>
                    {getFilteredOptions().map((data, index) => (
                        <div
                            key={index}
                            onClick={() => handleOptionSelect(data)}
                            className='flex items-center gap-[10px] w-full h-10 border-b-[1px] border-[#D2D2D2] px-[14px] py-2 cursor-pointer'>
                            <div className='flex text-white items-center justify-center w-6 h-6 my-1 rounded-full bg-[#D2D2D2]'>
                                {data.firstLetter}
                            </div>
                            <p className='text-base'>{data.label}</p>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default Search
