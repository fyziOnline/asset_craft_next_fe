import React, { FC } from 'react'

interface AssetViewerProps {
    children: React.ReactNode
}

const AssetViewer: FC<AssetViewerProps> = ({ children }) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default AssetViewer