"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  scheduledDates: Date[];  // Array of scheduled dates
  todayDate: Date;         // Today’s date
  onDateSelect?: (date: Date) => void; // Optional callback when a date is selected
}

const DatePicker: React.FC<DatePickerProps> = ({ scheduledDates, todayDate, onDateSelect }) => {
  const [date, setDate] = useState<Date>(new Date()); // Default to the current date
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const datePickerRef = useRef<HTMLDivElement | null>(null);

   // Function to handle the date selection, only updates the date if the selected date is defined
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      if (onDateSelect) {
        onDateSelect(selectedDate);
      }
    }
  };

  // Function to toggle the visibility of the calendar
  const handleShowDate = () => {
    setShowCalendar((prev) => !prev);
  }

  // Effect hook to close the calendar if a click happens outside of the DatePicker component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={datePickerRef}>
        <button className="bg-[#F0F0F0] w-[300px] h-[35px] rounded-full mb-2 text-start px-4"  onClick={handleShowDate}></button>
        {showCalendar && 
        <div className="absolute p-4 rounded-md border bg-white shadow-sm w-fit">
        <Calendar
            formatters={{
                formatWeekdayName: (date) => {
                    const day = date.getDay();
                    const customDayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                    return customDayNames[day];
                }
            }}
            mode="single"
            selected={date}
            onSelect={handleDateSelect} // onSelect now works with Date | undefined
            className="rounded-md px-0"
            modifiers={{
            scheduled: scheduledDates,
            highlighted: todayDate,
            }}
            modifiersStyles={{
                scheduled: {
                    backgroundColor: '#115e59',
                    color: 'white'
                },
                highlighted: {
                    backgroundColor: '#10b981',
                color: 'white'
            }
        }}
        components={{
            IconLeft: () => <ChevronLeft className="h-6 w-6" />,
            IconRight: () => <ChevronRight className="h-6 w-6" />,
            }}
            classNames={{
                months: "space-y-4",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50",
                nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex item-center w-full mt-4",
            head_cell: "text-black mx-2 rounded-md w-8 font-normal text-center",
            row: "flex w-full mt-1",
            cell: "relative py-[10px] px-2 text-center ",
            day: "h-8 w-8 p-0 font-normal rounded-full flex items-center justify-center bg-[#F5F5F7]",
            day_outside: "text-slate-500 opacity-50",
            day_disabled: "text-[#ADB3CC] opacity-50",
            day_hidden: "invisible",
            day_selected: "",
            day_today: "bg-green-500 text-white"
            }}
            
            />
        <div className="w-full h-[1px] border-t-2 border-green-300 mt-4"></div>
        <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-[10px]">
            <span className="w-4 h-4 rounded-full bg-green-500"></span>
            <span className="text-[#636363] text-base">Today</span>
            </div>
            <div className="flex items-center gap-[10px]">
            <span className="w-4 h-4 rounded-full bg-teal-700"></span>
            <span className="text-[#636363] text-base">Scheduled to be sent</span>
            </div>
        </div>
        </div>
        }
    </div>
  );
};

export default DatePicker;
