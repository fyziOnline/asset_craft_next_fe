import SearchIcon from '@/assets/icons/SearchIcon'
import React from 'react'

const SearchBox = () => {
  return (
    <div className='flex items-center gap-[10px] rounded-full w-[360px] border border-[rgba(217,217,217,0.93)] bg-white p-2'>
        <SearchIcon />
        <input type="text" placeholder='Search' className='bg-transparent border-none outline-none w-full h-full px-1 ' />
    </div>
  )
}

export default SearchBox