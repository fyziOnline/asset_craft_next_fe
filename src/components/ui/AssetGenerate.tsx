import React, { FC } from 'react'

interface AssetGenerateProps {
    children: React.ReactNode
}

const AssetGenerate: FC<AssetGenerateProps> = ({ children }) => {
  return (
    <div className='px-[10%] overflow-y-scroll scrollbar-hide h-[62vh]'>
        {children}
    </div>
  )
}

export default AssetGenerate