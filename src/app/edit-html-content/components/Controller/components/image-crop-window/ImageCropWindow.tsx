import { Dispatch, FC, SetStateAction } from 'react'

interface ImageEditWindowProp {
    setImageEditWindow : Dispatch<SetStateAction<boolean>>
}

const ImageEditWindow:FC<ImageEditWindowProp> = ({setImageEditWindow}) => {
  return (
    <div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] min-h-[400px] flex flex-col animate-slideUp'>
        <h1 className='text-lg text-green-200'>crop window </h1>
        <button
        onClick={()=>{setImageEditWindow(false)}}
        >close</button>
    </div>
  )
}

export default ImageEditWindow