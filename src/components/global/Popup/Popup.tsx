import { FC, ReactNode, useEffect, useRef } from "react"

type PopupProps = {
  children: ReactNode
  handleClickOutside?: () => void
  isPopupVisible : boolean
  className?: string
  stopPropagation?: boolean
}


 //  A reusable popup component that closes when clicked outside
 
const Popup: FC<PopupProps> = ({
  children,
  handleClickOutside = () => {},
  className = "",
  isPopupVisible = false,
  stopPropagation = true
}) => {
  const popupRef = useRef<HTMLDivElement | null>(null)
  
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        handleClickOutside()
      }
    }
    
    document.addEventListener('mousedown', handleOutsideClick)
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [handleClickOutside])

  const handleInnerClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation()
    }
  }

  return isPopupVisible ? (
    <div 
      ref={popupRef} 
      className={className}
      onClick={handleInnerClick}
    >
      {children}
    </div>
  ) : null
}

export default Popup