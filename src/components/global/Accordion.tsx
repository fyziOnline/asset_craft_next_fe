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
 * @param {void} props.handleShowContent - handle Show Content
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
  isRequire?: boolean;
  handleShowContent?: () => void;
}

const Accordion: React.FC<AccordionProps> = ({ HeaderTitle, children, checked = false, disableShowContent = false, isShowContent = false, isRequire = false, handleShowContent = () => { } }) => {
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
      handleShowContent()
    }
  }

  return (
    <div className={`flex flex-col border ${checked ? "border-sectionGrey-Liner bg-sectionGrey-lighter": "border-sectionGrey-darker bg-sectionGrey"} rounded-[20px] w-full`}>
      <div onClick={toggleContent} className={`flex items-center justify-between px-[8%] w-full h-[80px] cursor-pointer `}>
        <div className="flex items-center gap-9">
          <div>
            <label className="flex flex-row items-center gap-2.5 dark:text-white light:text-black">
              <input id="hr" type="checkbox" checked={checked} readOnly className="peer hidden" />
              <div className="h-8 w-8 flex items-center justify-center rounded-full  border-[#7F7F7F] light:bg-[#e8e8e8] bg-yellow-300 peer-checked:bg-green-300 peer-checked:opacity-68 peer-checked:border-none transition cursor-pointer">

                {checked ? (
                  <svg
                    className=""
                    width="20" height="20" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.2427 2.90918L7.57602 13.5758L2.72754 8.72736" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 289 289" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M121.687 167.484C122.784 178.913 124.645 187.407 127.205 193.011C129.794 198.596 134.406 201.386 141.041 201.383C142.283 201.383 143.394 201.189 144.496 200.963C145.624 201.189 146.731 201.383 147.982 201.383C154.611 201.383 159.216 198.593 161.799 193.011C164.373 187.407 166.202 178.913 167.322 167.484L173.219 79.2401C174.321 62.0416 174.874 49.6974 174.877 42.2075C174.88 32.0112 172.214 24.0562 166.879 18.3424C161.524 12.6316 154.489 9.77775 145.773 9.78076C145.308 9.78076 144.961 9.88462 144.505 9.90269C144.071 9.88462 143.714 9.78076 143.263 9.78076C134.53 9.78076 127.508 12.6301 122.161 18.3424C116.818 24.0652 114.145 32.0217 114.141 42.212C114.138 49.7019 114.692 62.0461 115.803 79.2446L121.687 167.484ZM144.726 233.638C136.264 233.638 129.075 236.307 123.105 241.645C117.138 246.988 114.154 253.468 114.151 261.084C114.151 269.678 117.176 276.442 123.182 281.355C129.215 286.268 136.251 288.724 144.292 288.724C152.478 288.724 159.621 286.3 165.723 281.45C171.82 276.609 174.868 269.809 174.868 261.093C174.868 253.477 171.951 246.997 166.116 241.654C160.285 236.307 153.15 233.635 144.712 233.638" fill="white" />
                  </svg>
                )}
              </div>
            </label>
          </div>
          <div className="flex">
            <p className="font-medium text-lg text-wrap tracking-normal text-[#000000]">{HeaderTitle}</p>
            {isRequire ? <p className="text-red-500">*</p> : null}
          </div>
        </div>
        <div className={`cursor-pointer transition-transform ${showContent ? "rotate-180" : ""}`}>
          <DownArrow 
            color= {!checked ? "#BBBBBB" : "#dedede"}
          />
        </div>
      </div>

      <div ref={contentRef} className={`${!showContent && "overflow-hidden" } transition-all duration-500 relative bottom-4`} style={{ height: showContent ? `auto` : "0px", }}>
        <div className="px-[15%] pb-4">{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
