'use client';

import { useEffect, useState } from "react";
import DatePicker from "@/components/global/DatePicker";
import LayoutWrapper from "@/layout/LayoutWrapper";

export default function Home() {
  const [scheduledDates, setScheduledDates] = useState<Date[]>([]);
  const todayDate = new Date();

  // Example to simulate fetching dates from an API or a dynamic source
  useEffect(() => {
    // Replace this with an actual API call or dynamic data source
    const fetchScheduledDates = () => {
      setScheduledDates([]);
    };

    fetchScheduledDates();
  }, []);

  // Handler function when a date is selected
  const handleDateChange = (newDate: Date) => {
    // You can add logic to modify scheduledDates if necessary
    console.log("Selected date:", newDate);
    // For example, adding the selected date to scheduledDates
    setScheduledDates(prevDates => [...prevDates, newDate]);
  };

  return (
    <>
      <LayoutWrapper layout="main">
        <div className="mt-10 mx-20 h-screen">
          <DatePicker
            scheduledDates={scheduledDates}
            todayDate={todayDate}
            onDateSelect={handleDateChange} // Pass the callback to DatePicker
          />
        </div>
      </LayoutWrapper>
    </>
  );
}
