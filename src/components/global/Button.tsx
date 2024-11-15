'use client';

import React from 'react';
import RightArrow from "../../assets/icons/RightArrow"

/**
 * Button component renders a button with customizable text, color, and an optional icon.
 * 
 * @param {Object} props - The properties for customizing the button.
 * @param {string} props.buttonText - The text displayed on the button (required).
 * @param {string} [props.textColor="text-white"] - The color of the text (optional).
 * @param {string} [props.iconColor="white"] - The color of the icon (optional).
 * @param {string} [props.backgroundColor="bg-custom-gradient-green"] - The background color of the button (optional).
 * @param {string} [props.customClass] - Any additional custom CSS classes for the button (optional).
 * @param {boolean} [props.showIcon=true] - Whether to show the arrow icon. Defaults to `true`.
 * @param {Function} [props.handleClick] - A callback function to handle the click event (optional).
 * @param {"button" | "submit" | "reset"}  [props.type="button"] - The type of the button (optional, default is "button").
 * 
 * @returns {JSX.Element} The Button component.
 */

interface ButtonProps {
    buttonText: string;
    textColor?: string;
    spanClass?: string
    iconColor? : string;
    backgroundColor?: string;
    customClass?: string;
    showIcon?: boolean;
    handleClick?: () => void;
    type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({ 
    buttonText,
    backgroundColor="bg-custom-gradient-green",
    textColor="text-white",
    spanClass = '',
    iconColor="white",
    customClass,
    showIcon = true,
    handleClick,
    type="button"
}) => {
  return (
    <button onClick={handleClick} type={type} className={` flex items-center justify-center gap-3 px-8 py-3 rounded-full ${backgroundColor} ${customClass} `}>
        <span className={`${spanClass} text-sm leading-[24px] font-bold ${textColor}`}>{buttonText}</span>
        {showIcon && <RightArrow color={iconColor} />}
    </button>
  )
}

export default Button