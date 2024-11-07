"use client";

import DownArrow from "@/assets/icons/DownArrow";
import { useState } from "react";

/**
 * Accordion component that allows toggling the visibility of content with a header.
 * 
 * @component
 * @example
 * // Example usage of the Accordion component
 * <Accordion HeaderTitle="Example Title">
 *   <div>Accordion content goes here</div>
 * </Accordion>
 * 
 * @param {string} HeaderTitle - The title that will appear in the header of the accordion.
 * @param {React.ReactNode} children - The content that will be revealed when the accordion is expanded.
 * 
 * @returns {JSX.Element} The rendered Accordion component.
 */


interface AccordionProps {
  HeaderTitle: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ HeaderTitle , children }) => {
  const [showContent, setShowContent] = useState(false)

  /**
   * Toggles the visibility of the accordion content.
   */
  const toggleContent = () => {
    setShowContent((prev) => !prev)
  }

  return (
    <div className={`flex items-center flex-col border border-[#9A9A9A] bg-white rounded-[20px] w-1/2 ${showContent ? "h-auto" : "h-[100px]"}`}>
      <div onClick={toggleContent} className={`flex items-center justify-between px-10 w-full h-full cursor-pointer  ${showContent && "pt-6 pb-4" }`}>
        <div className="flex items-center gap-9">
          <div>
            <label className="flex flex-row items-center gap-2.5 dark:text-white light:text-black">
              <input id="hr" type="checkbox" className="peer hidden" />
              <div className="h-8 w-8 flex rounded-full border border-[#7F7F7F] light:bg-[#e8e8e8] peer-checked:bg-green-300 peer-checked:opacity-68 peer-checked:border-none transition cursor-pointer">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-8 h-8 p-1 light:stroke-[#e8e8e8] dark:stroke-[#ffff]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12.6111L8.92308 17.5L20 6.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
            </label>
          </div>
          <div>
            <p className="font-semibold text-base">{HeaderTitle}</p>
          </div>
        </div>
        <div className="cursor-pointer">
          <DownArrow />
        </div>
      </div>

    {showContent && 
      <div>
        {children}
      </div>
    }
    </div>
  );
};

export default Accordion;
