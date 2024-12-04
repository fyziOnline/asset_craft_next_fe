import Image from "next/image"
import { FC } from "react"

interface Template {
  assetTypeID: string,
  assetTypeName: string,
  description: string,
  isActive: number,
  layoutID: string,
  templateID: string,
  templateImageURL: string,
  templateName: string,
}


interface TemplateViewerProps {
  templateData?: Template[]
  title: string
  aspect_ratio: string
  onProceed?: (selectedTemplate: string) => void
}

const TemplateSelectionContainer: FC<TemplateViewerProps> = ({ templateData = [], title = '', aspect_ratio, onProceed }) => {

  const onTemplateSelection = (template: Template) => {
    if (onProceed) {
      onProceed(template.templateID)
    }
  }

  return (
    <section >
      <h1 className="text-center font-bold mb-5">{title}</h1>
      <div className="flex justify-evenly gap-10 w-full overflow-x-auto">
        {templateData.map((template) => (
          <div key={template.templateID} className="flex flex-col items-center flex-shrink-0">
            <div
              className="h-[50vh] aspect-half  relative bg-gray-200 mb-4 cursor-pointer"
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
            <h2 className="text-sm font-bold">{template.templateName}</h2>
          </div>
        ))}

      </div>
    </section>
  )
}

export default TemplateSelectionContainer