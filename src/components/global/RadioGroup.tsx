'use client';

import React, { useState, useEffect } from 'react';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  name: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  name,
  defaultValue,
  onChange
}) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultValue);

  useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      {options.map((option) => (
        <div key={option.value} className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="radio"
              checked={selectedValue === option.value}
              onChange={() => handleChange(option.value)}
              className="h-5 w-5 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor={`${name}-${option.value}`} className="text-gray-800">
              {option.label}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RadioGroup; 