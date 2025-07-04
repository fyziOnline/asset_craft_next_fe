import React, { FC } from 'react'

type FieldHeaderProp = {
    header : string,
    isMandatory : boolean
}

const FieldHeader:FC<FieldHeaderProp> = ({header,isMandatory}) => {
  return (
    <>
        <div className='flex flex-col gap-3'>
            <h3 className='text-[#160647] text-base tracking-[0] leading-5 text-wrap whitespace-nowrap font-semibold'>{header} {isMandatory&&<span className="text-red-500">*</span>}</h3>
        </div>
    </>
  )
}

export default FieldHeader