import { Check } from "lucide-react";
import React from "react";

const sectionTitles = ["Task", "Asset", "Review"];

const ProgressionIndicator = ({ currentSection }: { currentSection: number }) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {sectionTitles.map((title, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out ${
                  index < currentSection
                    ? 'bg-green-500 text-steel-gray shadow-lg shadow-green-200'
                    : index === currentSection
                    ? 'bg-primary-black text-steel-gray shadow-lg shadow-faded-grey scale-110'
                    : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                }`}
              >
                {index < currentSection ? (
                  <Check color='#fff' className="w-6 h-6 animate-in fade-in duration-300" />
                ) : (
                  <span className="font-semibold text-base">{index + 1}</span>
                )}
              </div>
              {index === currentSection && (
                <div className="absolute -inset-1 rounded-full border-2 border-blue-300 animate-pulse"></div>
              )}
            </div>

            <span
              className={`mt-3 text-sm font-medium transition-colors duration-300 ${
                index <= currentSection ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              {title}
            </span>
          </div>

          {index < sectionTitles.length - 1 && (
            <div className="relative w-16 h-2 bg-gray-200 rounded-full mx-2 overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-in-out ${
                  index < currentSection
                    ? 'bg-gradient-to-r from-green-400 to-green-500 w-full'
                    : 'bg-gradient-to-r from-green-400 to-green-500 w-0'
                }`}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default ProgressionIndicator