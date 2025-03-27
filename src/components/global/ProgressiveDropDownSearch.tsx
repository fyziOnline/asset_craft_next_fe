import React, { FC, useState, useEffect, ChangeEvent, KeyboardEvent, useRef, useMemo } from 'react'

interface ProgressiveDropDownSearchProps {
  customClass?: string
  data?: Array<{ label: string, value: string }>
  placeholder?:string
  messageForNewData?:string
  preSelectedValue ?: string
  onSelect?: (name: string ) => void
}

const ProgressiveDropDownSearch: FC<ProgressiveDropDownSearchProps> = ({
  customClass,
  data = [], 
  placeholder,
  messageForNewData,
  preSelectedValue,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredData, setFilteredData] = useState(data)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [autofillHint,setAutoFillHint] = useState("")
  const [highlightedIndex,setHighlightedIndex] = useState<number>(-1)
  const [highlightedIndexOnHover,setHighlightedIndexOnHover] = useState<number>(-1)
  const [isMouseOverItem,setIsMouseOverItem] = useState<boolean>(false)
  const [initialUpdateFlag,setInitialUpdateFlag] = useState<boolean>(true)
  const dropdownRef = useRef<HTMLDivElement>(null)


  useEffect(()=>{
    if (!preSelectedValue || !preSelectedValue.length || !initialUpdateFlag) {
      return 
    }
    if (data.length) {
      setSearchTerm(preSelectedValue)
      if (!onSelect) {
        return
      }
      onSelect(preSelectedValue)
      setInitialUpdateFlag(false)
    }
  },[data])

  useEffect(() => {
    const filtered = data.filter(item =>
      item.value.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredData(filtered)
    if (filtered.length > 0 && searchTerm.length>0) {
       setAutoFillHint(filtered[0].value)
    } else {
      setAutoFillHint("")
    }
  }, [searchTerm, data])

  useEffect(() => {
    if (dropdownRef.current && highlightedIndex !== -1 && !isMouseOverItem) {
      const item = dropdownRef.current.children[highlightedIndex] as HTMLElement
      if (item) {
        item.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }
  }, [highlightedIndex,isMouseOverItem])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value
    setSearchTerm(newSearch)
    setHighlightedIndex(0)
    setIsDropdownOpen(true)
    if (onSelect) {
      onSelect(newSearch)
    }
  }

  const handleItemSelect = (item: { label: string, value: string }) => {
    setSearchTerm(item.value)
    setIsDropdownOpen(false)
    if (onSelect) onSelect(item.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && filteredData.length > 0) {
      e.preventDefault()
      handleItemSelect(filteredData[0])
    }
    if (e.key === 'ArrowDown' && filteredData.length > 0) {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredData.length - 1))
    }

    if (e.key === 'ArrowUp' && filteredData.length > 0) {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.max(prev - 1, 0)) 
    }

    if (e.key === 'Enter' && highlightedIndex >= 0 && filteredData[highlightedIndex]) {
      e.preventDefault()
      handleItemSelect(filteredData[highlightedIndex])
    }
  }

  return (
    <div className={`relative z-99 ${customClass}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={()=>setIsDropdownOpen(false)}
          onKeyDown={handleKeyDown}
          className={`w-full px-4 cur h-12 border rounded-lg focus:outline-none ${!autofillHint.length? "text-black" : "text-transparent" }  caret-black`}
          placeholder={placeholder}
        />
        {autofillHint && (
            <div
              className="absolute inset-0 px-4 h-12 flex items-center  pointer-events-none"
              style={{ color: '#bbb', zIndex: 1 }}
            >
              <span>
                <span className='text-black'>{searchTerm}</span>
                <span className='text-gray-400' style={{ opacity: 0.3 }}>
                  {autofillHint.slice(searchTerm.length)}
                </span>
              </span>
            </div>
          )}
      </div>

      {isDropdownOpen && (
        <div
          ref={dropdownRef} 
          style={{scrollBehavior: "smooth"}}
          onMouseEnter={()=>setIsMouseOverItem(true)}
          onMouseLeave={()=>{
            setIsMouseOverItem(false)
            setHighlightedIndex(highlightedIndexOnHover)
            setHighlightedIndexOnHover(-1)
          }}
          className="absolute max-h-[8rem] w-full mt-3 bg-white border-none rounded-lg shadow-lg  overflow-y-auto z-99">
          {filteredData.map((item,index) => (
            <div
              key={item.label}
              className={`px-4 py-2 cursor-pointer ${
                highlightedIndexOnHover !== -1 && highlightedIndexOnHover === index
                ? 'bg-gray-200'
                : highlightedIndexOnHover === -1 && highlightedIndex === index
                ? 'bg-gray-200'
                : 'hover:bg-gray-100'
             }`}
              onMouseDown={() => handleItemSelect(item)} 
              onMouseEnter={() => {
                setHighlightedIndexOnHover(index)
              }}
            >
              {item.value}
            </div>
          ))}
          {filteredData.length < 1 && searchTerm.length>0 &&
            <div className="group px-4 py-2 text-gray-600 hover:bg-green-50 cursor-pointer">
              <p className='italic group-hover:text-green-100'>{`${messageForNewData}"${searchTerm}"`}</p>
            </div>
          }
        </div>
      )}
    </div>
  )
}

export default ProgressiveDropDownSearch