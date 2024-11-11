"use client"

import React, { useEffect, useRef, useState } from 'react'
import SearchIcon from '@/assets/icons/SearchIcon'
import { SearchDownArrow } from '@/assets/icons/DownArrow'

/**
 * Search component for filtering and selecting a person from a list of options.
 *
 * @param {Object} props - The properties passed to the Search component.
 * @param {string} [props.placeHolder="Search for a person..."] - The placeholder text for the search input field.
 * @param {Option[]} [props.optionsList=[]] - The list of options to search through.
 * @param {string} [props.customOuterClass=""] - Custom outer class to apply to the component.
 * @param {Function} [props.onPersonSelect] - Callback to execute when a person is selected.
 *
 * @returns {React.FC} The Search component.
 */


interface SearchProps {
    placeHolder?: string;
    optionsList?: Option[];
    customOuterClass?: string;
    onPersonSelect?: () => void
}

interface Option {
    label?: string;
    value?: string;
    firstLetter?: string;
    IconColor?: string;
}

const Search: React.FC<SearchProps> = ({ optionsList = [], placeHolder = "Search for a person...", customOuterClass ="" }) => {
    const [isOpen , setIsOpen] = useState(false);
    const [selectValue, setSelectValue] = useState<Option | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const searchRef = useRef<HTMLDivElement | null>(null);

    // Toggles the open/close state of the dropdown.
    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    }

    // Handles the selection of an option.
    const handlePersonClick = (value: {}) => {
        setSelectValue(value);
        setIsOpen(false);
    }

    // Filters the options based on the search query.
    const filteredOptions = optionsList.filter(option =>
        option.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.value?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        <div ref={searchRef} className={`flex flex-col w-[300px] ${customOuterClass} `}>
            <div onClick={handleToggle} className={`flex items-center gap-1 bg-[#F0F0F0] px-[14px] cursor-pointer h-[45px] ${isOpen ? "rounded-t-[16px] " : "rounded-full shadow-search-box-shadow"}`}>
                <SearchIcon />
                {selectValue?.value ? 
                    <div className='flex items-start px-1 w-full h-8'>
                        <div className='flex items-center gap-[10px] ring-2 ring-[#00BA88] ring-offset-0 rounded-full p-[5px]' >
                            <div className={`flex items-center justify-center w-5 h-5 rounded-full ${selectValue.IconColor}`}>
                                <span className='text-sm'>{selectValue.firstLetter}</span>
                            </div>
                            <p className='text-sm'>{selectValue.value}</p>
                        </div>
                    </div> 
                    : 
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={placeHolder} 
                        className='bg-transparent border-none outline-none w-full h-full px-1 placeholder-black' 
                    />
                }
                <span className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "" }`}><SearchDownArrow /></span>
            </div>
            {isOpen && 
            <div className='flex flex-col bg-white rounded-b-[16px] shadow-search-box-shadow'>
                {filteredOptions.map((data , index) => (
                    <div 
                        key={index} 
                        onClick={() => handlePersonClick(data)} 
                        className='flex items-center gap-[10px] w-full h-10 border-t-[1px] border-black px-[14px] cursor-pointer'
                    >
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full ${data.IconColor}`}>
                            <span>{data.firstLetter}</span>
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
