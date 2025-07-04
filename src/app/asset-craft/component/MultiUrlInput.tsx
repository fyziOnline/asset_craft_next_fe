import FieldHeader from "@/components/global/FieldHeader";
import { Globe, PlusCircle, XCircle } from "lucide-react";
import { FC } from "react";

type MultiUrlInputProp = {
    label : string 
    urls : string[]
    setUrls : (urls:string[]) => void
}

const MultiUrlInput:FC<MultiUrlInputProp> = ({ label, urls, setUrls }) => {
  const addUrl = () => setUrls([...urls, ""]);
  const removeUrl = (index:number) => setUrls(urls.filter((_, i) => i !== index));
  const updateUrl = (index:number, value:string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };
  return (
    <div>
      <FieldHeader 
        header="Campaign URLs"
        isMandatory = {false}
      />
      <div className="space-y-2 mt-3">
        {urls.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-gray-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => updateUrl(index, e.target.value)}
              placeholder="https://..."
              className="flex-grow block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01A982] focus:border-[#01A982]"
            />
            <button
              type="button"
              onClick={() => removeUrl(index)}
              className="text-red-500 hover:text-red-700"
            >
              <XCircle size={20} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addUrl}
          className="flex items-center gap-2 text-sm font-medium text-[#01A982] hover:text-[#007A60]"
        >
          <PlusCircle size={16} /> Add URL
        </button>
      </div>
    </div>
  );
};

export default MultiUrlInput