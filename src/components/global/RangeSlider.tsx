'use client'

import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'

interface RangeProp {
    minValue?: string
    maxValue?: string
    steps?: number
    label?: string
    onSelectValue?: (value: number) => void
    defaultValue?: number
}

const RangeSlider: FC<RangeProp> = ({ minValue = '0', maxValue = '10', steps = 10, label = 'range', onSelectValue = () => { }, defaultValue = 5 }) => {
    const min = parseInt(minValue, 10);
    const max = parseInt(maxValue, 10);
    const range = max - min;
    const stepSize = range / steps;

    const calculateInitialValue = (defaultVal: number) => {
        const clampedDefault = Math.max(min, Math.min(max, defaultVal)); 
        return ((clampedDefault - min) / range) * 100; 
    };

    const calculateInitialDisplayValue = (defaultVal: number) => {
         const clampedDefault = Math.max(min, Math.min(max, defaultVal));
         return Math.round((clampedDefault - min) / stepSize) * stepSize + min;
    };
    
    const [internalValue, setInternalValue] = useState<number>(calculateInitialValue(defaultValue)); 
    const [displayValue, setDisplayValue] = useState<number>(calculateInitialDisplayValue(defaultValue)); 
    const outputRef = useRef<HTMLSpanElement>(null);

    const snapValue = (val: number) => {
        const scaledValue = (val / 100) * range + min;
        const snappedStepValue = Math.round((scaledValue - min) / stepSize) * stepSize + min;
        return Math.max(min, Math.min(max, snappedStepValue)); 
    };

    const handleRangeSelection = (e: ChangeEvent<HTMLInputElement>) => {
        const rangeValue = parseInt(e.target.value, 10);
        setInternalValue(rangeValue);
        const snappedValue = snapValue(rangeValue);
        setDisplayValue(snappedValue);
        onSelectValue(snappedValue);
    };

    useEffect(() => {
        const newInitialValue = calculateInitialValue(defaultValue);
        const newInitialDisplayValue = calculateInitialDisplayValue(defaultValue);
        setInternalValue(newInitialValue);
        setDisplayValue(newInitialDisplayValue);
    }, [defaultValue, min, max, range, stepSize]);

    useEffect(() => {
        if (outputRef.current) {
            const percentage = internalValue;
            outputRef.current.style.left = `calc(${percentage}% - ${percentage * 0.1}px)`;
        }
    }, [internalValue]);

    return (
        <div className='relative pt-6'>
            <div className='relative h-4'>
                <span 
                  ref={outputRef} 
                  className='absolute bottom-full mb-1 text-sm text-gray-700 font-medium transform -translate-x-1/2 px-1 bg-white rounded shadow'
                  style={{ }}
                >
                    {displayValue}
                </span>
                
                <label htmlFor="range" className='sr-only'>{label}</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={internalValue}
                    title=''
                    id='range'
                    onChange={handleRangeSelection}
                    className='custom-range bg-grey-700 absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-10'
                />
                <div className="absolute top-1/2 left-0 right-0 h-2 rounded-lg bg-gray-200 pointer-events-none transform -translate-y-1/2"></div>
                <div 
                  className="absolute top-1/2 left-0 h-2 rounded-lg bg-green-500 pointer-events-none transform -translate-y-1/2 z-0" 
                  style={{ width: `${internalValue}%` }} 
                ></div>
            </div>
            <p className='absolute left-0 top-full mt-1 text-sm text-grey-300'>{min}</p>
            <p className={`absolute right-0 top-full mt-1 text-sm text-grey-300`}>{max}</p>
        </div>
    )
}

export default RangeSlider