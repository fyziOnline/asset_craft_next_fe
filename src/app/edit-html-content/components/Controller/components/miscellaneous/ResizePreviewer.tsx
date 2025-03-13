import { AspectRatioObject, Dimension } from '@/types/visualLibrary'
import { FC, useEffect, useRef, useState } from 'react'

type ResizePreviewerProp = {
  aspectratio: AspectRatioObject
  outerBoxWidth: number
//   outerBoxHeight: number
  innerBoxWidth: number
}

const ResizePreviewer: FC<ResizePreviewerProp> = ({ aspectratio, outerBoxWidth, innerBoxWidth }) => {
  const [dimension, setDimensions] = useState<Dimension>({ width: 30, height: 30 })
  const [innerBoxDimension, setInnerBoxDimension] = useState<{dimension: Dimension, coordinates: {x: number, y: number}}>({
    dimension: { width: 20, height: 20 },
    coordinates: { x: 0, y: 0 }
  })
  
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (outerRef.current) {
      const { width, height } = outerRef.current.getBoundingClientRect()
      setDimensions({ width, height })
    }
  }, [])

  useEffect(() => {
    if (dimension.width > 0 && dimension.height > 0) {
      const relativeInnerBoxWidth = dimension.width * (innerBoxWidth / outerBoxWidth)
      const relativeInnerBoxHeight = relativeInnerBoxWidth / (aspectratio.w_part / aspectratio.h_part)
      
      setInnerBoxDimension({
        dimension: {
          width: relativeInnerBoxWidth,
          height: relativeInnerBoxHeight
        },
        coordinates: {
          x: (dimension.width - relativeInnerBoxWidth) / 2,
          y: (dimension.height - relativeInnerBoxHeight) / 2
        }
      })
    }
  }, [dimension, innerBoxWidth, outerBoxWidth, aspectratio.w_part, aspectratio.h_part])


  return (
    <>
      {/* OUTER BOX */}
      <div
        ref={outerRef} 
        className="relative w-full h-full border border-green-100"
        style={{ aspectRatio: `${aspectratio.w_part}/${aspectratio.h_part}` }}
      >
        {/* LINES FROM OUTER BOXES TO INNER BOX */}
        {innerBoxDimension.dimension.width < dimension.width &&
        <>
            <svg className="absolute top-0 left-0 w-full h-full">
            <line
                x1="0" y1="0"
                x2={innerBoxDimension.coordinates.x} y2={innerBoxDimension.coordinates.y}
                stroke="#dcd3d1"
                strokeWidth="1"
                strokeDasharray="5,5"
            />
            <line
                x1={dimension.width} y1="0"
                x2={innerBoxDimension.coordinates.x + innerBoxDimension.dimension.width} y2={innerBoxDimension.coordinates.y}
                stroke="#dcd3d1"
                strokeWidth="1"
                strokeDasharray="5,5"
            />
            <line
                x1={innerBoxDimension.coordinates.x} y1={innerBoxDimension.coordinates.y + innerBoxDimension.dimension.height}
                x2="0" y2={dimension.height}
                stroke="#dcd3d1"
                strokeWidth="1"
                strokeDasharray="5,5"
            />
            <line
                x1={innerBoxDimension.coordinates.x + innerBoxDimension.dimension.width} 
                y1={innerBoxDimension.coordinates.y + innerBoxDimension.dimension.height}
                x2={dimension.width} y2={dimension.height}
                stroke="#dcd3d1"
                strokeWidth="1"
                strokeDasharray="5,5"
            />
            </svg>

            {/* INNER BOX */}
            <div
            ref={innerRef} 
            className="absolute border border-gray-200"
            style={{
                aspectRatio: `${aspectratio.w_part}/${aspectratio.h_part}`,
                width: `${innerBoxDimension.dimension.width}px`,
                height: `${innerBoxDimension.dimension.height}px`,
                top: `${innerBoxDimension.coordinates.y}px`,
                left: `${innerBoxDimension.coordinates.x}px`,
            }}
            ></div>
        </>
        }
      </div>
    </>
  )
}

export default ResizePreviewer