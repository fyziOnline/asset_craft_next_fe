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
      <div className="py-10 px-16 border-t border-solid border-[#D9D9D9]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center">
            <p className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap">
              {title}
            </p>
          </div>
          <div className="flex justify-evenly gap-5 w-full mt-6 flex-wrap">
            {templateData.map((template) => (
              <div key={template.templateID} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
                <div
                  className="h-[55vh] aspect-half relative bg-gray-200 mb-4"
                  style={{ aspectRatio: aspect_ratio }}
                  onClick={() => onTemplateSelection(template)}
                >
                  <Image
                    src={template.templateImageURL}
                    alt={template.description}
                    fill
                    className="object-fill"
                  />
                </div>
                <div className="[font-family:'Inter-Medium',Helvetica] font-medium text-black text-[21.6px] text-center tracking-[0]">
                  {template.templateName || ''}
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