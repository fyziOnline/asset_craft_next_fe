'use client';

import { EmailIcon, LinkedinIcon, SalesCallIcon } from '@/assets/icons/TableIcon';
import React, { useEffect, useState } from 'react'

/**
 * Table component displays a customizable table with sortable columns.
 *
 * @param {Object} props - The props object for the Table component.
 * @param {Array<Object<string, string>>} props.listItems - The list of data items to be displayed in the table, where each item is an object with key-value pairs representing column data.
 * @param {Array<string>} props.tableHeadings - The headings of the columns, displayed at the top of the table.
 * @param {Array<string>} [props.arrowInHeadings=[]] - An optional array of column headings that will display sortable arrows, allowing the user to sort the data by those columns.
 * @param {Array<string>} [props.columnWidths=[]] - An optional array of column widths, where each width corresponds to a column. If specified, it controls the width of each column using CSS units (e.g., '1fr', '200px'). Defaults to equal width for each column if not provided.
 * eg:- columnWidths={['4fr', '1fr', '1fr']}
 * @param {string} [props.IconAssetName] - An optional prop to specify a column name to display an icon (e.g., "Email_1", "LinkedIn_1").
 * @param {React.ReactNode} [props.IconComponent] - An optional React component to render as an icon next to the data for the specified column.
 * 
 * @returns {JSX.Element} A JSX element representing the table, with sortable columns and optional icon rendering.
 */

interface Options {
  [key: string]: string;
}

interface TableProps {
  listItems: Options[];
  tableHeadings: string[];
  arrowInHeadings?: string[];
  columnWidths?: string[];
  IconAssetName?: string;
  fieldClick?: string;
  handleClick?: (value: any) => void;
  IconComponent?: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ listItems, tableHeadings, arrowInHeadings = [], columnWidths = [], IconAssetName, IconComponent, fieldClick, handleClick = () => { } }) => {
  const [sortListData, setSortListData] = useState<Options[]>(listItems);
  const [sortArrows, setSortArrows] = useState<{ [key: string]: boolean }>({ ...tableHeadings.reduce((acc, heading) => ({ ...acc, [heading]: true }), {}) });

  // Extract column names from the first item in the list
  const getListItemsHeadings = listItems.length > 0 ? Object.keys(listItems[0]).filter((item) => item != fieldClick) : []

  useEffect(() => {
    setSortListData(listItems)
  }, [listItems])

  // Function to get the status class based on the status value for styling purposes
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'text-[#5DB9FF] font-semibold';  // Blue background for In Progress
      case 'Pending Approval':
        return 'text-[#1CD3A8] font-semibold';  // Green background for Pending Approval
      case 'Completed':
        return 'text-[#00A881] font-semibold';  // Green background for Complete
      default:
        return 'text-black';  // Default gray background for unknown status
    }
  }


  /**
   * Returns the corresponding icon for a given value.
   * 
   * @param {string | undefined} value - The value that determines the icon.
   * @returns {JSX.Element | null} The corresponding icon element, or null if no icon is found.
   */
  const getIcon = (value: string | undefined) => {
    const icons: { [key: string]: JSX.Element } = {
      Email_1: <EmailIcon />,
      LinkedIn_1: <LinkedinIcon />,
      SalesCall_1: <SalesCallIcon />,
    };
    return value ? icons[value] || null : null;
  };

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

  // Set dynamic widths for columns or fallback to equal width if not provided
  const gridColumnStyle = columnWidths.length === getListItemsHeadings.length ? columnWidths.join(' ') : `repeat(${getListItemsHeadings.length}, 1fr)`;

  return (
    <div className='w-full'>
      <div className="grid gap-[10px] text-center p-6" style={{ gridTemplateColumns: gridColumnStyle }}>
        {tableHeadings.map((heading, index) => (
          <div key={index} className='flex items-center gap-2'>
            <p className='text-base font-semibold text-grey-800'>{heading}</p>
            {arrowInHeadings.includes(heading) && (
              <span className={`cursor-pointer transition-transform ${sortArrows[heading] ? "rotate-180" : ""}`} onClick={() => handleSort(index)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="7" viewBox="0 0 13 7" fill="none">
                  <path d="M12 6L6.5 1L1 6" stroke="#818181" />
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>

      <div className='grid gap-[10px]'>
        {sortListData.map((data, index) => {
          if (getListItemsHeadings.length === 0) { return }
          return (
            <div onClick={() => {
              if (fieldClick !== undefined) {
                handleClick(data[fieldClick])
              }
            }} key={index} className={`grid p-6 border border-[#00A881] rounded-xl cursor-pointer`} style={{ gridTemplateColumns: gridColumnStyle }}>
              {getListItemsHeadings.map((heading, idx) => (
                <div key={idx} className={`flex items-center gap-2 text-sm font-normal ${getStatusClass(data[heading] || '')}`}>
                  {heading === IconAssetName && IconComponent}
                  {getIcon(data[heading])}
                  {data[heading]}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Table;
