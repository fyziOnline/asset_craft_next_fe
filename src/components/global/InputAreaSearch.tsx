import React, { useState } from "react";
import TextField from "./TextField";

type Props = {
    placeholder:string,
    name:string,
}

const InputAreaSearch: React.FC<Props> = ({placeholder,name}) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const dummyData = [
    {
      id: 1,
      value: "GreenLake Marketing",
    },
    {
      id: 2,
      value: "BlueOcean Solutions",
    },
    {
      id: 3,
      value: "Tech Innovators",
    },
    {
        id: 4,
        value: "GreenLake Marketing 2",
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchValue(e.target.value);
  };

  const words = searchValue.trim().split(/\s+/).filter(Boolean)
  
  const matchedItems = dummyData.filter((item) =>
    words.every((word) => item.value.toLowerCase().includes(word.toLowerCase()))
  );

  return (
    <div className="border border-[#DCD8E8] w-full rounded-[10px]">
      <TextField
        customClass="h-12 border-none"
        placeholder={placeholder}
        name={name}
        handleChange={handleChange}
      />

      {searchValue && matchedItems.length > 0 && (
        <div className="flex flex-wrap">
          {matchedItems.map((matchedItem) => (
            <div
              key={matchedItem.id}
              className="bg-off-white-primary w-fit px-3 py-1 rounded-full mx-2 mb-2 text-sm"
            >
              <h3>{matchedItem.value}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputAreaSearch;
