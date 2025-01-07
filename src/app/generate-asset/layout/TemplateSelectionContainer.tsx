import Image from "next/image"
import { FC } from "react"
import { Template } from "@/types/templates"

interface TemplateViewerProps {
  templateData?: Template[]
  title: string
  aspect_ratio: string
  onProceed?: (selectedTemplate: Template) => void
}

const TemplateSelectionContainer: FC<TemplateViewerProps> = ({ templateData = [], title = '', aspect_ratio, onProceed }) => {

  const onTemplateSelection = (template: Template) => {
    if (onProceed) {
      onProceed(template)
    }
  }

  return (
    <section >
      <div className="pt-5 pb-10 px-10 border-t border-solid border-[#D9D9D9]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center">
            <p className="font-bold text-black text-2xl tracking-wide whitespace-nowrap">
              {title}
            </p>
          </div>
          <div className="flex justify-evenly gap-5 w-full mt-4 flex-wrap">
            {templateData.map((template) => (
              <div key={template.templateID} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
                <div className="text-black text-xl pb-2 text-center tracking-wide">
                  {template.templateName || ''}
                </div>
                <div
                  className="w-[250px] relative bg-gray-200 mb-4 hover:shadow-2xl transition-all duration-300"
                  // style={{ aspectRatio: aspect_ratio }}
                  onClick={() => onTemplateSelection(template)}
                >
                  <img
                    src={template.templateImageURL || ""}
                    alt={template.description || ""}
                    className="bg-no-repeat bg-center bg-cover border border-solid border-[#dadada]"
                  />
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TemplateSelectionContainer