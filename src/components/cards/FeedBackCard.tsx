import React, { useState } from 'react'

// Define props type
interface FeedBackCardProps {
    isFeedbackOpen: boolean; // Boolean state to track feedback visibility
    setIsFeedbackOpen: React.Dispatch<React.SetStateAction<boolean>>; // Function to update the state
}

const FeedBackCard: React.FC<FeedBackCardProps> = ({ isFeedbackOpen, setIsFeedbackOpen }) => {




    return (

        <div className="relative">
            {/* Message Icon */}
            {!isFeedbackOpen && ( // Show icon only if feedback is closed. please provide ! for show icon
                <div
                    className="p-[10px] relative rounded-full bg-[#00A881] cursor-pointer my-1 w-9 h-9 flex items-center"
                    onClick={() => setIsFeedbackOpen(true)} // Open feedback panel
                >
                    <svg
                        width="27"
                        height="28"
                        viewBox="0 0 28 27"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0.652344 26.9305V2.90547C0.652344 2.17137 0.913949 1.54316 1.43716 1.02084C1.96037 0.498518 2.58858 0.236913 3.32179 0.236023H24.6773C25.4114 0.236023 26.0401 0.497629 26.5633 1.02084C27.0865 1.54405 27.3477 2.17226 27.3468 2.90547V18.9221C27.3468 19.6562 27.0856 20.2849 26.5633 20.8081C26.041 21.3313 25.4123 21.5925 24.6773 21.5916H5.99123L0.652344 26.9305ZM13.9996 17.5874C14.3777 17.5874 14.695 17.4593 14.9512 17.203C15.2075 16.9467 15.3352 16.63 15.3343 16.2527C15.3334 15.8754 15.2053 15.5586 14.9499 15.3024C14.6945 15.0461 14.3777 14.918 13.9996 14.918C13.6214 14.918 13.3046 15.0461 13.0492 15.3024C12.7939 15.5586 12.6657 15.8754 12.6648 16.2527C12.664 16.63 12.7921 16.9472 13.0492 17.2043C13.3064 17.4615 13.6232 17.5892 13.9996 17.5874ZM12.6648 12.2485H15.3343V4.24019H12.6648V12.2485Z"
                            fill="white"
                        />
                    </svg>
                    <div className="bg-[#E06565] absolute rounded-full w-[12px] h-[12px] top-[-3px] right-[-2px]"></div>
                </div>
            )}
        </div>

    )
}

export default FeedBackCard