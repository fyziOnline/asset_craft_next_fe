import React, { FC, ReactNode, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface SectionProps {
  title: string
  children: ReactNode
  componentStyle?: React.CSSProperties
  defaultOpen?: boolean
  disabled?: boolean
}

const Section: FC<SectionProps> = ({
  title,
  children,
  componentStyle,
  defaultOpen = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="pt-6" style={{ ...componentStyle }}>
      <div
        className="flex items-center justify-between group cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
          {title}
        </h3>
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 ease-in-out transform hover:scale-105"
          aria-label={isOpen ? 'Collapse section' : 'Expand section'}
        >
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      <hr className="my-3 border-gray-200" />

      <div
        className={`relative overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Content */}
        <div className="space-y-6 pb-2 relative z-10">{children}</div>

        {/* Off-white overlay */}
        {disabled && (
          <div className="absolute inset-0 bg-white/60 z-20 pointer-events-auto cursor-not-allowed" />
        )}
      </div>
    </div>
  )
}

export default Section