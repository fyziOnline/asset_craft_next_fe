'use client';

import { EmailIcon, LinkedinIcon, SalesCallIcon } from '@/assets/icons/TableIcon';
import React, { useEffect, useState } from 'react';

interface Options {
  [key: string]: string;
}

interface TableProps {
  listItems: Options[];
  tableHeadings: string[];
  arrowInHeadings?: string[];
  columnWidths?: string[];
  IconAssetName?: string;
  IconComponent?: React.ReactNode;
  viewType?: string;
  onSelectingProject?: (project_name: string) => void;
}

const Table: React.FC<TableProps> = ({
  listItems,
  tableHeadings,
  arrowInHeadings = [],
  columnWidths = [],
  IconAssetName,
  IconComponent,
  viewType,
  onSelectingProject
}) => {
  const [sortListData, setSortListData] = useState<Options[]>(listItems);

  // Get all data keys excluding campaignID
  const getListItemsHeadings = listItems.length > 0 
    ? Object.keys(listItems[0]).filter(key => key !== 'campaignID')
    : [];

  // Filter out campaignID from table headings if present
  const filteredTableHeadings = tableHeadings.filter((heading, index) => {
    const correspondingKey = getListItemsHeadings[index];
    return correspondingKey !== 'campaignID';
  });

  // Adjust column widths to match filtered headings
  const filteredColumnWidths = columnWidths.filter((_, index) => {
    const correspondingKey = getListItemsHeadings[index];
    return correspondingKey !== 'campaignID';
  });

  const [sortArrows, setSortArrows] = useState<{ [key: string]: boolean }>(
    { ...filteredTableHeadings.reduce((acc, heading) => ({ ...acc, [heading]: true }), {}) }
  );

  useEffect(() => {
    setSortListData(listItems);
  }, [listItems]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'text-[#5DB9FF] font-semibold';
      case 'Pending Approval':
        return 'text-[#1CD3A8] font-semibold';
      case 'Completed':
        return 'text-[#00A881] font-semibold';
      default:
        return 'text-black';
    }
  };

  const getIcon = (value: string | undefined) => {
    const icons: { [key: string]: JSX.Element } = {
      Email_1: <EmailIcon />,
      LinkedIn_1: <LinkedinIcon />,
      SalesCall_1: <SalesCallIcon />,
    };
    return value ? icons[value] || null : null;
  };

  const handleSort = (column: number) => {
    const columnHeading = filteredTableHeadings[column];
    const columnKey = getListItemsHeadings[column];
    const isAscending = !sortArrows[columnHeading];

    setSortArrows((prevArrows) => ({
      ...prevArrows,
      [columnHeading]: isAscending,
    }));

    const sortedData = [...sortListData].sort((a, b) => {
      const valueA = a[columnKey]?.toLowerCase() || '';
      const valueB = b[columnKey]?.toLowerCase() || '';
      return isAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    setSortListData(sortedData);
  };

  const gridColumnStyle = filteredColumnWidths.length === getListItemsHeadings.length 
    ? filteredColumnWidths.join(' ') 
    : `repeat(${getListItemsHeadings.length}, 1fr)`;

  const handleClick = (data: any) => {
    const identifier = viewType === "project" ? data.projectName : data.campaignID;
    if (onSelectingProject) {
      onSelectingProject(identifier);
    }
  };

  return (
    <div className='w-full'>
      <div className="grid gap-[10px] text-center p-6" style={{ gridTemplateColumns: gridColumnStyle }}>
        {filteredTableHeadings.map((heading, index) => (
          <div key={index} className='flex items-center gap-2'>
            <p className='text-base font-semibold text-grey-800'>{heading}</p>
            {arrowInHeadings.includes(heading) && (
              <span 
                className={`cursor-pointer transition-transform ${sortArrows[heading] ? "rotate-180" : ""}`} 
                onClick={() => handleSort(index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="7" viewBox="0 0 13 7" fill="none">
                  <path d="M12 6L6.5 1L1 6" stroke="#818181" />
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>

      <div className='grid gap-[10px]'>
        {sortListData.map((data, index) => (
          <div 
            onClick={() => handleClick(data)} 
            key={index} 
            className='grid p-6 border border-[#00A881] rounded-xl cursor-pointer'
            style={{ gridTemplateColumns: gridColumnStyle }}
          >
            {getListItemsHeadings.map((heading, idx) => (
              <div key={idx} className={`flex items-center gap-2 text-sm font-normal ${getStatusClass(data[heading] || '')}`}>
                {heading === IconAssetName && IconComponent}
                {getIcon(data[heading])}
                {data[heading]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;