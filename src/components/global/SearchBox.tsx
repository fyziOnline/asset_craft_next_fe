import SearchIcon from '@/assets/icons/SearchIcon'
import React, { ChangeEvent } from 'react'

type SearchBoxProps = {
  customClass?: string;
  setSearchQuery?: (query: string) => void;
}

const SearchBox:React.FC<SearchBoxProps> = ({ customClass, setSearchQuery }) => {
  return (
    <div className={`flex items-center gap-[10px] rounded-full w-[360px] border border-[rgba(217,217,217,0.93)] p-2 ${customClass}`}>
        <SearchIcon customColor='#00A881'/>
        <input type="text" placeholder='Search' onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery?.(e.target.value)} className='bg-transparent border-none outline-none w-full h-full px-1 ' />
    </div>
  )
}

export default SearchBox