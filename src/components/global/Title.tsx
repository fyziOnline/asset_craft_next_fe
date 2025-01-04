import React from 'react'

interface TitleProps {
    titleName: string;
}

const Title: React.FC<TitleProps> = ({ titleName = "" }) => {
  return (
    <div className='text-xl text-[#7F7F7F] leading-normal font-bold'>{titleName}</div>
  )
}

export default Title