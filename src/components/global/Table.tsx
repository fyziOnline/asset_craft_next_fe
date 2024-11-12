'use client';

import React, { useState } from 'react'

/**
 * Table is a React component that displays a table with sortable columns.
 * @param listItems - The list of data items to be displayed in the table.
 * @param tableHeadings - The headings of the columns.
 * @param arrowInHeadings - The columns that will have sortable arrows.
 * @returns A JSX element representing the table.
 */

interface Options {
  [key: string]: string;
}

interface TableProps {
  listItems: Options[];
  tableHeadings: string[];
  arrowInHeadings: string[];
}

const Table: React.FC<TableProps> = ({ listItems, tableHeadings, arrowInHeadings }) => {
    const [sortListData, setSortListData] = useState<Options[]>(listItems);
    const [sortArrows, setSortArrows] = useState<{ [key: string]: boolean }>({...tableHeadings.reduce((acc, heading) => ({ ...acc, [heading]: true }), {}) });


    // Extract column names from the first item in the list
    const getListItemsHeadings = Object.keys(listItems[0]);

    // Function to get the status class based on the status value for styling purposes
    const getStatusClass = (status: string) => {
        switch (status) {
        case 'In Progress':
            return 'text-[#5DB9FF]';  // Blue background for In Progress
        case 'Pending Approval':
            return 'text-[#1CD3A8]';  // Green background for Pending Approval
        case 'Completed':
            return 'text-[#00A881]';  // Green background for Complete
        default:
            return 'text-black';  // Default gray background for unknown status
        }
    }

    // Function to handle sorting when a column header is clicked
    const handleSort = (column: number) => {
        const columnHeading = tableHeadings[column]; // Get the column heading
        const columnKey = getListItemsHeadings[column]; // Get the corresponding key for the column in the data
        const isAscending = !sortArrows[columnHeading]; // Toggle sort direction

        // Update the state for sort arrows
        setSortArrows((prevArrows) => ({
            ...prevArrows,
            [columnHeading]: isAscending,
        }));

        // Sort the data based on the column and sort direction
        const sortedData = [...sortListData].sort((a, b) => {
            const valueA = a[columnKey]?.toLowerCase() || '';
            const valueB = b[columnKey]?.toLowerCase() || '';
      
            return isAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        });

        // Update the state with the sorted data
        setSortListData(sortedData);
    };
    
    
  return (
    <div className='w-full'>
      <div className="grid text-center p-6" style={{ gridTemplateColumns: `repeat(${getListItemsHeadings.length}, 1fr)` }}>
        {tableHeadings.map((heading, index) => (
          <div key={index} className='flex items-center gap-2'>
            <p className='text-base font-semibold'>{heading}</p>
            {arrowInHeadings.includes(heading) && (
              <span className={`cursor-pointer transition-transform ${sortArrows[heading] ? "rotate-180" : "" }`} onClick={() => handleSort(index)}>
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
          <div key={index} className={`grid p-6 border border-[#00A881] rounded-xl`} style={{ gridTemplateColumns: `repeat(${getListItemsHeadings.length}, 1fr)` }}>
            {getListItemsHeadings.map((heading, idx) => (
              <div key={idx} className={`text-sm font-normal ${getStatusClass(data[heading] || '')}`}>
                {data[heading]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Table;
