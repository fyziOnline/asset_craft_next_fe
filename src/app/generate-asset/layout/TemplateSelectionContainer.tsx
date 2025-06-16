"use client"

import { FC } from "react"
import { Template } from "@/types/templates"

interface TemplateViewerProps {
  templateData?: Template[]
  onProceed?: (selectedTemplate: Template) => void
}

const TemplateSelectionContainer: FC<TemplateViewerProps> = ({ templateData = [], onProceed }) => {
  const onTemplateSelection = (template: Template) => {
    onProceed?.(template)
  }

  return (
    <section className="pt-5 pb-10 px-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 scrollbar-hide">
          {templateData.map((template) => (
            <div
              key={template.templateID}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer snap-start"
              style={{ width: "33.33%" }} // show 3 items in view
            >
              <div className="text-black text-xl pb-2 text-center tracking-wide group-hover:text-green-300 duration-300">
                {template.templateName || ''}
              </div>
              <div
                className="w-[250px] relative bg-gray-200 mb-4 hover:shadow-2xl transition-all duration-300"
                onClick={() => onTemplateSelection(template)}
              >
                <img
                  src={template.templateImageURL || ""}
                  alt={template.description || ""}
                  className="bg-no-repeat bg-center bg-cover border border-solid border-[#191919] w-full h-auto"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TemplateSelectionContainer
