import { FC, useState, useMemo } from 'react'
// import LayoutWrapper from '../LayoutWrapper'
// import Breadcrumb from '@/components/global/Breadcrumb'
import AssetCard from '@/components/wrapper/AssetCard'
import { GridIcon, ListIcon } from '@/assets/icons/AppIcons'
import Table from '@/components/global/Table'
import Title from '@/components/global/Title'
import SearchBox from "@/components/global/SearchBox";
import DropDown from '@/components/global/DropDown'
import FilterDropdown from '@/components/global/FilterDropdown'


interface Asset {
  [key: string]: string
}

interface AssetsPageProps {
  fieldClick?: string;
  campaign_data: Asset[]
  // onSelectingCampaign : (campaign_name:string)=>void
  tableHeadings: string[]
  headersHavingToggle: string[]
  hiddenFields?: string[]
  columnWidthsTable?: string[]
  handleClick?: (value: any) => void;
  page: string
  isIconRequired?: boolean
}

const AssetsPageLayout: FC<AssetsPageProps> = ({ campaign_data, tableHeadings, headersHavingToggle, hiddenFields = [], page, handleClick, columnWidthsTable = [], isIconRequired = true }) => {
  const [isList, setIsList] = useState<Boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [getSelectedValue, setSelectedValue] = useState<string>('')
  console.log('getSelectedValue', getSelectedValue);

  const params = new URLSearchParams(window.location.search);
  const type = params.get('type')

  const toggleListType = () => {
    setIsList(pre => !pre)
  }

  const filterOptionsAsset = [
    { label: 'Email', value: 'Email' },
    { label: 'LinkedIn', value: 'LinkedIn' },
    { label: 'Landing Page', value: 'Landing Page' },
    { label: 'Call Script', value: 'Call Script' }
  ]

  const filterOptionsStatus = [
    { label: 'In Progress', value: 'In Progress' },
    { label: 'On Review', value: 'On Review' },
  ]

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return campaign_data;  // Show all data if search is empty

    return campaign_data.filter((item) => {
      const projectName = item['projectName']?.toLowerCase() || '';
      const campaignName = item['campaignName']?.toLowerCase() || '';
      const assetName = item['assetName']?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();

      return (
        projectName.includes(query) ||
        campaignName.includes(query) ||
        assetName.includes(query)
      )
    })
  }, [searchQuery, campaign_data])




  return (
    <>
      <div className="flex items-center justify-between pt-[1rem] px-[1.5rem] mt-5">

        <div className="flex items-center gap-5">

          {/* <Breadcrumb TaskType={page} /> */}
          <Title titleName={page} />

          <div className='flex items-center gap-4'>
            <SearchBox customClass="bg-[#F6F6F6]" setSearchQuery={setSearchQuery} />
            {
              type !== 'Email' && type !== 'Landing Page' && type !== 'Call Script' && type !== 'LinkedIn' &&
              <FilterDropdown placeholder='Select Asset Type' optionLists={filterOptionsAsset} customClass="bg-[#F6F6F6]" selectedValue={setSelectedValue} />
            }
            <FilterDropdown placeholder='Select Status' optionLists={filterOptionsStatus} customClass="bg-[#F6F6F6]" selectedValue={setSelectedValue} />
          </div>

        </div >

        <span className="pr-10 cursor-pointer" onClick={toggleListType}>{!isList ? <ListIcon /> : <GridIcon />}</span>
      </div>
      <div className="px-4 lg:px-16 xl:px-20 overflow-y-scroll h-[85vh] scrollbar-hide">
        {filteredData.length === 0 ?
          <div className="w-full h-[70vh] flex justify-center items-center text-gray-500">No data available</div>
          : !isList ?
            <div className=" asset-grid-layout mt-4  justify-center overflow-auto">
              {filteredData.map((data, index) => (
                <div key={index}
                >
                  <AssetCard data={data} />
                </div>
              ))}
            </div>
            :
            <Table
              isPagination={true}
              columnWidths={columnWidthsTable}
              handleClick={handleClick}
              hiddenFields={hiddenFields}
              listItems={filteredData}
              tableHeadings={tableHeadings}
              isIconRequired={isIconRequired}
              arrowInHeadings={headersHavingToggle} />}
        <div className='h-[10vh]' />
      </div>
    </>
  )
}

export default AssetsPageLayout