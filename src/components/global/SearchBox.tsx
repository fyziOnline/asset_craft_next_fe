import SearchIcon from '@/assets/icons/SearchIcon'
import React from 'react'

type SearchBoxProps = {
  customClass?: string;
}

const SearchBox:React.FC<SearchBoxProps> = ({ customClass }) => {
  return (
    <div className={`flex items-center gap-[10px] rounded-full w-[360px] border border-[rgba(217,217,217,0.93)] p-2 ${customClass}`}>
        <SearchIcon customColor='#00A881'/>
        <input type="text" placeholder='Search' className='bg-transparent border-none outline-none w-full h-full px-1 ' />
    </div>
  )
}

export default SearchBox