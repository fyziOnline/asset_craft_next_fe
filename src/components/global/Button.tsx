'use client';

import React from 'react';
import RightArrow from "../../assets/icons/RightArrow"
import { AllinOne } from "@/assets/icons/AppIcons"

/**
 * Button component renders a button with customizable text, color, and an optional icon.
 * 
 * @param {Object} props - The properties for customizing the button.
 * @param {string} props.buttonText - The text displayed on the button (required).
 * @param {string} [props.textColor="text-white"] - The color of the text (optional).
 * @param {string} [props.iconColor="white"] - The color of the icon (optional).
 * @param {string} [props.backgroundColor="bg-custom-gradient-green"] - The background color of the button (optional).
 * @param {string} [props.customClass] - Any additional custom CSS classes for the button (optional).
 * @param {string} [props.customClassIcon] - Any additional custom CSS classes for the icon (optional).
 * @param {boolean} [props.showIcon=true] - Whether to show the arrow icon. Defaults to `true`.
 * @param {Function} [props.handleClick] - A callback function to handle the click event (optional).
 * @param {"button" | "submit" | "reset"}  [props.type="button"] - The type of the button (optional, default is "button").
 * 
 * @returns {JSX.Element} The Button component.
 */

interface ButtonProps {
  buttonText: string;
  textColor?: string;
  textStyle?: string;
  iconColor?: string;
  backgroundColor?: string;
  customClass?: string;
  customClassIcon?: string;
  showIcon?: boolean;
  IconComponent?: React.ReactNode;
  handleClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  buttonText,
  backgroundColor = "bg-custom-gradient-green",
  textColor = "text-white",
  iconColor = "white",
  textStyle = "",
  IconComponent = null,
  customClass,
  customClassIcon = "",
  showIcon = true,
  handleClick,
  type = "button"
}) => {
  return (
    <button onClick={handleClick} type={type} className={` ${customClass} inline-flex whitespace-nowrap items-center justify-center gap-3   rounded-full ${backgroundColor}`}>
      <p className={`flex items-center gap-1 text-sm leading-[24px] font-bold ${textColor} ${textStyle}`}>{IconComponent}{buttonText}</p>
      <div className={customClassIcon}>
        {showIcon && <RightArrow color={iconColor} />}
      </div>
    </button>
  )
}

export default Button