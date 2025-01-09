import React, { useState } from "react";
import TextField from "./TextField";

type Props = {
  placeholder: string,
  name: string,
  listData?: string[],
  onChange?: (value: string) => void;
}

const InputAreaSearch: React.FC<Props> = ({ placeholder, name, listData = [], onChange = () => { } }) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [matchedItems, setMatchedItems] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchValue(e.target.value);
    onChange(e.target.value)

    const words = e.target.value.trim().split(/\s+/).filter(Boolean)
    const newMatchedItems = listData.filter((item) =>
      words.every((word) => item.toLowerCase().includes(word.toLowerCase()))
    );
    setMatchedItems(newMatchedItems.splice(0, 5))
  };

  return (
    <div className=" w-full rounded-[5px]">
      <TextField
        customClass="h-12 border-none"
        placeholder={placeholder}
        name={name}
        value={searchValue}
        handleChange={handleChange}
      />

      {searchValue && matchedItems.length > 0 && (
        <div className="flex flex-wrap bg-white mt-[-12px] rounded-[10px]">
          {matchedItems.map((matchedItem, index) => (
            <div
              key={matchedItem + index}
              onClick={() => {
                setMatchedItems([])
                onChange(matchedItem)
                setSearchValue(matchedItem)
              }}
              className="bg-off-white-primary px-5 py-1 rounded-full ml-3 mb-2 mt-[2px] text-sm cursor-pointer"
            >
              <h3>{matchedItem}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputAreaSearch;
