import Image from "next/image"
import { FC } from "react"

interface Template {
  id: string
  imageUrl: string
  template_name: string
}

interface TemplateViewerProps {
  templateData ?: Template[]
  title : string
  aspect_ratio : string
}

const TemplateSelectionContainer:FC<TemplateViewerProps> = ({templateData=[],title='',aspect_ratio}) => {
  return (
    <section>
      <h1 className="text-center font-bold mb-5">{title}</h1>
      <div className="flex justify-evenly gap-10 w-full overflow-x-auto">
        {templateData.map((template)=>(
          <div key={template.id} className="flex flex-col items-center flex-shrink-0">
            <div
              className="h-[50vh] aspect-half  relative bg-gray-200 mb-4"
              style={{aspectRatio:aspect_ratio}}
            >
              <Image
                src={template.imageUrl}
                alt={template.template_name}
                fill
                className="object-fill"
              />
            </div>
            <h2 className="text-sm font-bold">{template.template_name}</h2>
          </div>
        ))}
        
      </div>
    </section>
  )
}

export default TemplateSelectionContainer