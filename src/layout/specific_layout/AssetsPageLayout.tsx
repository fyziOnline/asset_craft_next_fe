import { FC, useState, useMemo, useEffect } from 'react'
import AssetCard from '@/components/wrapper/AssetCard'
import { GridIcon, ListIcon } from '@/assets/icons/AppIcons'
import Table from '@/components/global/Table'
import Title from '@/components/global/Title'
import SearchBox from "@/components/global/SearchBox";
import FilterDropdown from '@/components/global/FilterDropdown'
import { Pagination, Stack } from '@mui/material'


interface Asset {
  [key: string]: string
}

interface AssetsPageProps {
  fieldClick?: string;
  campaign_data: Asset[]
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
  const [getSelectedStatus, setGetSelectedStatus] = useState<string>('')
  const [getSelectedAssetType, setGetSelectedAssetType] = useState<string>('');
  const [type, setType] = useState<string>('');

  const [gridCurrentPage, setGridCurrentPage] = useState<number>(1)
  const ITEM_PER_PAGE = 9


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setType(params.get('type') || "");
    }
  }, []);
  const toggleListType = () => {
    setIsList(pre => !pre)
    setGridCurrentPage(1)
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
    if (!searchQuery.trim() && !getSelectedStatus && !getSelectedAssetType) return campaign_data;

    return campaign_data.filter((item) => {
      const projectName = item['projectName']?.toLowerCase() || '';
      const campaignName = item['campaignName']?.toLowerCase() || '';
      const assetName = item['assetName']?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();

      const matchSearchQuery = projectName.includes(query) ||
        campaignName.includes(query) ||
        assetName.includes(query);

      const matchStatus = getSelectedStatus ? item['currentStatus'] === getSelectedStatus : true;
      const matchAssetType = getSelectedAssetType ? item['assetTypeIcon'] === getSelectedAssetType : true;

      return matchSearchQuery && matchStatus && matchAssetType;
    });
  }, [searchQuery, campaign_data, getSelectedStatus, getSelectedAssetType]);

  const paginatedGridData = useMemo(() => {
    const startIndex = (gridCurrentPage - 1) * ITEM_PER_PAGE;
    const endIndex = startIndex + ITEM_PER_PAGE;
    return filteredData.slice(startIndex, endIndex);
  }, [gridCurrentPage, filteredData])


  const gridTotalPages = Math.ceil(filteredData.length / ITEM_PER_PAGE);


  const handleGridPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setGridCurrentPage(value)
  }
  return (
    <>
      <div className="flex items-center justify-between pt-[1rem] px-[1.5rem] mt-5">

        <div className="flex items-center gap-5">

          <Title titleName={page} />

          <div className='flex items-center gap-4'>

            <SearchBox
              customClass="bg-[#F6F6F6]"
              setSearchQuery={(query) => {
                setSearchQuery(query)
                setGridCurrentPage(1)
              }}
            />            {
              type !== 'Email' && type !== 'Landing Page' && type !== 'Call Script' && type !== 'LinkedIn' &&
              <FilterDropdown
                placeholder="Select Asset Type"
                optionLists={filterOptionsAsset}
                customClass="bg-[#F6F6F6]"
                selectedValue={(value) => {
                  setGetSelectedAssetType(value);
                  setGridCurrentPage(1);
                }}
              />
            }
            <FilterDropdown placeholder='Select Status' optionLists={filterOptionsStatus} customClass="bg-[#F6F6F6]" selectedValue={(value) => {
              setGetSelectedStatus(value);
              setGridCurrentPage(1);
            }} />
          </div>
        </div >

        <span className="pr-10 cursor-pointer" onClick={toggleListType}>{!isList ? <ListIcon /> : <GridIcon />}</span>
      </div>
      <div className="px-4 lg:px-16 xl:px-20 overflow-y-scroll h-[85vh] scrollbar-hide">
        {filteredData.length === 0 ?
          <div className="w-full h-[70vh] flex justify-center items-center text-gray-500">No data available</div>
          : !isList ?
            <>
              <div className=" asset-grid-layout mt-4  justify-center overflow-auto">
                {paginatedGridData.map((data, index) => (
                  <div key={index}
                  >
                    <AssetCard data={data} />
                  </div>
                ))}
              </div>

              {gridTotalPages > 1 && (
                <div className='flex justify-center mt-2'>
                  <Stack spacing={2}>
                    <Pagination
                      count={gridTotalPages}
                      page={gridCurrentPage}
                      showFirstButton
                      showLastButton
                      onChange={handleGridPageChange}
                    />
                  </Stack>
                </div>
              )}
            </>
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