import { FC } from "react"

interface StatusProp {
  status_value : "0" | "1" 
}
const statusText = {
  '0' : 'In Progress',
  '1' : 'To be Approved'
}

const getLabelTheme = (status: StatusProp) => {
  return status.status_value === '0' ? 'some-theme-for-0' : 'some-theme-for-1';
};

const StatusLabel:FC<StatusProp> = ({status_value}) => {
  return (
    <div className="border-2 border-crystal-blue-500 group-hover:border-black bg-crystal-blue-200 group-hover:bg-white w-fit px-[1rem] rounded-full ">
      <p className="text-crystal-blue-500 group-hover:text-black">{statusText[status_value]}</p> 
    </div>
  )
}

export default StatusLabel