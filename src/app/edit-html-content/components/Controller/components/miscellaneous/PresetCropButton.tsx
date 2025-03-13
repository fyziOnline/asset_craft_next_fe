import { PresetCropOptions } from '@/data/ui/data'
import { FC } from 'react'

interface PresetCropButtonProp {
    handleAspectChange : (value:number) => void
    buttonText : string
    iconStyle ?: object
    aspectRatio : number
    b_key : number
}

const PresetCropButton:FC<PresetCropButtonProp> = ({handleAspectChange,buttonText,iconStyle,aspectRatio,b_key}) => {
  return (
    <>
        <button type='button'
        key={b_key}
        className='blue-btn-rounded'
        onClick={() => handleAspectChange(aspectRatio)}>   
            <div className="flex items-center gap-2">
              {/* <span className={`${iconClass} border-white border-dashed border p-2`}></span> */}
              <span className={` border-blue-700 border-dashed border p-2`} style={iconStyle}></span>
              <span>{buttonText}</span>
            </div>
        </button>
    </>
  )
}

export default PresetCropButton