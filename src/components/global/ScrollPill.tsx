import React, { useState, useEffect, useRef } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface ScrollPillProps {
  className?: string
  containerSelector?: string
}

const ScrollPill: React.FC<ScrollPillProps> = ({ 
  className = '', 
  containerSelector = '.scrollbar-hide'
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'none'>('none')
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const container = document.querySelector(containerSelector) as HTMLElement
    setScrollContainer(container)
  }, [containerSelector])

  useEffect(() => {
    if (!scrollContainer) return

    const checkScrollbarPresence = () => {
      // Check if scrollbar is present by comparing scrollHeight vs clientHeight
      const hasScrollbar = scrollContainer.scrollHeight > scrollContainer.clientHeight
      setIsVisible(hasScrollbar)
      return hasScrollbar
    }

    const handleScroll = () => {
      const hasScrollbar = checkScrollbarPresence()
      
      if (hasScrollbar) {
        const scrollTop = scrollContainer.scrollTop
        
        if (scrollTop > lastScrollTop) {
          setScrollDirection('down')
        } else if (scrollTop < lastScrollTop) {
          setScrollDirection('up')
        }
        
        setLastScrollTop(scrollTop)

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          setScrollDirection('none')
        }, 150)
      }
    }

    // Check scrollbar presence on various events
    const checkOnEvents = () => {
      setTimeout(checkScrollbarPresence, 10)
    }

    // Initial check
    checkScrollbarPresence()

    // Listen for scroll events
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    
    // Listen for content changes that might affect scrollbar
    scrollContainer.addEventListener('DOMSubtreeModified', checkOnEvents) // Legacy
    
    // Modern approach - MutationObserver
    const observer = new MutationObserver(checkOnEvents)
    observer.observe(scrollContainer, {
      childList: true,
      subtree: true,
      attributes: true
    })

    window.addEventListener('resize', checkOnEvents)
    
    const resizeObserver = new ResizeObserver(checkOnEvents)
    resizeObserver.observe(scrollContainer)

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
      scrollContainer.removeEventListener('DOMSubtreeModified', checkOnEvents)
      window.removeEventListener('resize', checkOnEvents)
      observer.disconnect()
      resizeObserver.disconnect()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [lastScrollTop, scrollContainer])

  const scrollToTop = () => {
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const scrollToBottom = () => {
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  if (!isVisible || !scrollContainer) return null

  return (
    <div 
      className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-50 ${className}`}
      style={{
        transform: `translateY(-50%) ${
          scrollDirection === 'up' ? 'translateY(-8px)' : 
          scrollDirection === 'down' ? 'translateY(8px)' : 'translateY(0)'
        }`,
        transition: 'transform 0.2s ease-out'
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg p-1 flex flex-col">
        <button
          onClick={scrollToTop}
          className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
          aria-label="Scroll to top"
        >
          <ChevronUp 
            size={16} 
            className={`transition-colors duration-200 ${
              scrollDirection === 'up' 
                ? 'text-gray-800' 
                : 'text-gray-400'
            }`}
          />
        </button>
        
        <div className="w-full h-px bg-gray-200 my-1" />
        
        <button
          onClick={scrollToBottom}
          className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
          aria-label="Scroll to bottom"
        >
          <ChevronDown 
            size={16} 
            className={`transition-colors duration-200 ${
              scrollDirection === 'down' 
                ? 'text-gray-800' 
                : 'text-gray-400'
            }`}
          />
        </button>
      </div>
    </div>
  )
}

export default ScrollPill