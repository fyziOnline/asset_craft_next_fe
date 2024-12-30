import { FC, useState } from 'react'
// import LayoutWrapper from '../LayoutWrapper'
import Breadcrumb from '@/components/global/Breadcrumb'
import AssetCard from '@/components/wrapper/AssetCard'
import { GridIcon, ListIcon } from '@/assets/icons/AppIcons'
import Table from '@/components/global/Table'

interface Asset {
  [key: string]: string
}

interface AssetsPageProps {
  campaign_data: Asset[]
  // onSelectingCampaign : (campaign_name:string)=>void
  tableHeadings: string[]
  headersHavingToggle: string[]
  page: string
}

const AssetsPageLayout: FC<AssetsPageProps> = ({ campaign_data, tableHeadings, headersHavingToggle, page }) => {
  const [isList, setIsList] = useState<Boolean>(true)
  const toggleListType = () => {
    setIsList(pre => !pre)
  }  
  
  return (
    <>
      <div className="flex items-center justify-between pt-[1rem] px-[1.5rem]">
        <Breadcrumb TaskType={page} />
        <span className="pr-10 cursor-pointer" onClick={toggleListType}>
          {!isList ? <ListIcon /> : <GridIcon />}
        </span>
      </div>
      <div className="px-4 lg:px-16 xl:px-20">
        {!isList ? (
          <div className="asset-grid-layout mt-4 justify-center overflow-auto">
            {campaign_data.map((data, index) => (
              <div key={index}>
                <AssetCard data={data} />
              </div>
            ))}
          </div>
        ) : (
          campaign_data.length > 0 ? (
            <Table
              listItems={campaign_data}
              tableHeadings={tableHeadings}
              arrowInHeadings={headersHavingToggle}
            />
          ) : (
            <div className="w-full h-[70vh] flex justify-center items-center text-gray-500">No data available</div>
          )
        )}
      </div>
    </>
  );
}

export default AssetsPageLayout