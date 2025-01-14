'use client';
import React, { useState } from 'react';

interface options {
    label: string;
    value: string;
}

interface ChooseLabelProps {
    optionLists: options[]
    onSelect?:  (valueSelected:options) => void
}

const ChooseLabel: React.FC<ChooseLabelProps> = ({ optionLists,onSelect = () => {} }) => {
    const [selectedOption, setSelectedOption] = useState(optionLists[0].value || '')

    const handleSelectList = (option: options) => {
        setSelectedOption(option.value)
        onSelect(option)
    }
    return (
        <div>
            {optionLists.map((options, index) => (
                <div className='flex items-center gap-1.5 relative self-stretch w-full mt-4'
                    key={index}
                    onClick={() => handleSelectList(options)} >
                    <div className='relative w-4 h-4 rounded-lg border border-solid border-[#0067b3] flex items-center justify-center'>
                        {selectedOption === options.value ? <div className='bg-[#073634] w-[10px] h-[10px] rounded-lg'></div> : null}
                    </div>
                    <div className="mr-[6px] relative [font-family:'Roboto-Medium',Helvetica] font-medium text-[#160647] text-[16px] tracking-[0]">
                        {options.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChooseLabel;