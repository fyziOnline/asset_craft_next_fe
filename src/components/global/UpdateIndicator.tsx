import{ FC } from 'react'

interface IndicatorProp {
    date : string
    img ?: string
}

const UpdateIndicator:FC<IndicatorProp> = ({date='20 Jan 2024',img=''}) => {
  return (
    <div className='grid grid-cols-[2.5rem,1fr] grid-rows-[repeat(2,auto)] gap-x-[0.8rem] max-w-fit'>
        <div className="w-full aspect-square bg-[url('/images/userProfile.jpeg')] bg-cover bg-center rounded-full col-span-1 row-span-2"></div>
        <p className='text-sm font-semibold flex items-center group-hover:text-white'>Last Updated</p>
        <p className='text-sm font-medium text-faded-grey group-hover:text-white'>{date}</p>
    </div>
  )
}
export default UpdateIndicator