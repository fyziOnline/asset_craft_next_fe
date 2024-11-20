"use client";

import { DownArrow } from "@/assets/icons/DownArrow";
import { useEffect, useRef, useState } from "react";

/**
 * Accordion component that allows toggling the visibility of content with a header.
 *
 * This component renders a header that can be clicked to toggle the visibility of the content.
 * It includes a customizable title, a checkbox indicator, and children content.
 *
 * @component
 * @example
 * <Accordion HeaderTitle="Example Title" checked={true}>
 *   <div>Accordion content goes here</div>
 * </Accordion>
 *
 * @param {Object} props - The props object for the Accordion component.
 * @param {string} props.HeaderTitle - The title displayed in the accordion header.
 * @param {boolean} props.checked - Indicates if the checkbox is selected (read-only).
 * @param {boolean} props.disableShowContent - disable Show Content
 * @param {boolean} props.isShowContent - Show Content
 * @param {React.ReactNode} props.children - The content displayed when the accordion is expanded.
 *
 * @returns {JSX.Element} The rendered Accordion component.
 */


interface AccordionProps {
  HeaderTitle: string;
  checked?: boolean;
  children: React.ReactNode;
  disableShowContent?: boolean;
  isShowContent?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ HeaderTitle, children, checked = false, disableShowContent = false, isShowContent = false }) => {
  const [showContent, setShowContent] = useState(isShowContent)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setShowContent(isShowContent);
  }, [isShowContent])
  /**
   * Toggles the visibility of the accordion content.
   */
  const toggleContent = () => {
    if (!disableShowContent) {
      setShowContent((prev) => !prev)
    }
  }

  return (
    <div className='flex flex-col border border-[#9A9A9A] bg-white rounded-[20px] w-full'>
      <div onClick={toggleContent} className={`flex items-center justify-between px-20 w-full h-[100px] cursor-pointer `}>
        <div className="flex items-center gap-9">
          <div>
            <label className="flex flex-row items-center gap-2.5 dark:text-white light:text-black">
              <input id="hr" type="checkbox" checked={checked} readOnly className="peer hidden" />
              <div className="h-8 w-8 flex items-center justify-center rounded-full border border-[#7F7F7F] light:bg-[#e8e8e8] peer-checked:bg-green-300 peer-checked:opacity-68 peer-checked:border-none transition cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.2427 2.90918L7.57602 13.5758L2.72754 8.72736" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </label>
          </div>
          <div>
            <p className="font-semibold text-[20px]">{HeaderTitle}</p>
          </div>
        </div>
        <div className={`cursor-pointer transition-transform ${showContent ? "rotate-180" : ""}`}>
          <DownArrow />
        </div>
      </div>

      <div ref={contentRef} className="overflow-hidden transition-all duration-500 relative bottom-4" style={{ height: showContent ? `auto` : "0px", }}>
        <div className="pl-[150px] pr-[74px] pb-4">{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
