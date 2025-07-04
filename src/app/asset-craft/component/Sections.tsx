import React, { FC, ReactNode } from 'react'

interface SectionProps {
  title : string,
  children : ReactNode
}


const Section:FC<SectionProps> = ({ title, children }) => {
  return (
  <div className="pt-6">
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    <hr className="my-3" />
    <div className="space-y-6">{children}</div>
  </div>
  )
}

export default Section