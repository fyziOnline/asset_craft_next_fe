import React from 'react'

interface TitleProps {
  titleName: string;
  classNameCustom?: string;
}

const Title: React.FC<TitleProps> = ({ titleName = "", classNameCustom = "" }) => {
  return (
    <div className={`text-xl text-[#7F7F7F] leading-normal font-bold ${classNameCustom}`} >{titleName}</div>
  )
}

export default Title