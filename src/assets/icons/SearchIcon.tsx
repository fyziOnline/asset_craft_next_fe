import React from 'react'

type SearchIconProps = {
  customColor?: string;
}

const SearchIcon:React.FC<SearchIconProps> = ({ customColor }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
        <path d="M8.91511 16.1242C13.0905 16.1242 16.4752 12.7394 16.4752 8.56404C16.4752 4.38869 13.0905 1.00391 8.91511 1.00391C4.73977 1.00391 1.35498 4.38869 1.35498 8.56404C1.35498 12.7394 4.73977 16.1242 8.91511 16.1242Z" stroke={customColor ? customColor : "black"} strokeWidth="1.62003" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.3652 18.0141L14.2544 13.9033" stroke={customColor ? customColor : "black"} strokeWidth="1.62003" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default SearchIcon