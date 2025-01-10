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

const RangeSlider: FC<RangeProp> = ({ minValue = '0', maxValue = '100', steps = 10, label = 'range', onSelectValue = () => { }, defaultValue = 7 }) => {
    const singleStepRange = parseInt(maxValue) / steps

    const clampedDefaultValue = defaultValue * singleStepRange 
    
    const [value, setValue] = useState<number>(clampedDefaultValue)
    const [valueToDisplay, setValueToDisplay] = useState<number>(clampedDefaultValue)
    const selectRangeRef = useRef<HTMLParagraphElement>(null)

    const setSnapToValue = (value: number) => {
        return Math.round(value / singleStepRange)
    }

    const handleRangeSelection = (e: ChangeEvent<HTMLInputElement>) => {
        const rangeValue = parseInt(e.target.value)
        setValue(rangeValue)
        const snapToValue = setSnapToValue(rangeValue)
        setValueToDisplay(snapToValue)
        onSelectValue(snapToValue)
    }

    const onHandleRelease = () => {
        setValue(valueToDisplay * singleStepRange)
        if (selectRangeRef.current) {
            selectRangeRef.current.innerText = valueToDisplay.toString()
        }
    }

    useEffect(() => {
        if (selectRangeRef.current) {
            selectRangeRef.current.innerText = defaultValue.toString();
        }
        setValue(clampedDefaultValue)
        setValueToDisplay(clampedDefaultValue)
    }, [defaultValue]);


    return (
        <div className='relative'>
            <div>
                <label htmlFor="range" className='sr-only'>{label}</label>
                <input
                    type="range"
                    min={minValue}
                    max={maxValue}
                    value={value}
                    title=''
                    id='range'
                    onChange={handleRangeSelection}
                    onMouseUp={onHandleRelease}
                    onTouchEnd={onHandleRelease}
                    className='custom-range bg-grey-700 '
                />
                <div className="absolute z-0 top-[5%] h-4 rounded-lg bg-green-100 pointer-events-none" style={{ width: `${(value / parseInt(maxValue)) * 100}%` }} ></div>
            </div>
            <p ref={selectRangeRef} className='absolute left-0 top-[75%] text-grey-300'>{defaultValue}</p>
            <p className={`absolute right-0 top-[75%] ${value !== parseInt(maxValue) ? 'text-grey-300' : 'text-green-100'}`}>{steps}</p>
        </div>
    )
}

export default RangeSlider