import React from "react";

/**
 * A reusable TextField component that renders a textarea with customizable properties.
 * 
 * @param {string} [name] - The name of the textarea field, used for form submission.
 * @param {string} [id] - The id of the textarea field, useful for associating a label.
 * @param {string} [value] - The current value of the textarea field.
 * @param {string} [customClass] - Custom CSS class(es) to apply to the textarea container.
 * @param {boolean} [disabled=false] - Whether the textarea is disabled.
 * @param {boolean} [readOnly=false] - Whether the textarea is read-only.
 * @param {string} placeholder - The placeholder text to display in the textarea field.
 * @param {(e: React.FormEvent<HTMLTextAreaElement>) => void} [handleChange] - The event handler for textarea value changes.
 * 
 * @returns {JSX.Element} The rendered TextField component.
 */

interface TextFieldProps {
  name?: string;
  id?: string;
  value?: string;
  customClass?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder: string;
  handleChange?: (e: React.FormEvent<HTMLTextAreaElement>) => void;
}
const TextField: React.FC<TextFieldProps> = ({ 
  name, 
  id,
  value,
  customClass = "",
  disabled = false,
  readOnly = false,
  placeholder,
  handleChange
}) => {
  return (
    <div className={`border border-[#DCD8E8] w-full rounded-[10px] ${customClass}`}>
      <textarea 
        name={name}
        id={id}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full h-full border-none px-3 py-3  rounded-[10px] text-sm italic outline-none resize-none"
      />
    </div>
  )
}

export default TextField