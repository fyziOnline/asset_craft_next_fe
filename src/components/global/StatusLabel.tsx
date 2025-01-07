import { FC } from "react";

interface StatusProp {
  status_value: "0" | "1" | "2" | "3";
}

const statusCorrespondence: Record<
  StatusProp["status_value"],
  { text: string; theme: string }
> = {
  "0": {
    text: "In Progress",
    theme: "border-crystal-blue-500 text-crystal-blue-500 bg-crystal-blue-200",
  },
  "1": {
    text: "To be approved",
    theme: "border-green-100 text-green-100 bg-green-mist",
  },
  "2": {
    text: "Pending Approval",
    theme: "border-crystal-blue-500 text-crystal-blue-500 bg-crystal-blue-200",
  },
  "3": {
    text: "Completed",
    theme: "border-green-100 text-white bg-green-100",
  },
};

const StatusLabel: FC<StatusProp> = ({ status_value }) => {
  const statusData = statusCorrespondence[status_value] || {
    text: "Unknown Status",
    theme: "border-gray-400 text-gray-400 bg-gray-200",
  };

  return (
    <div
      className={`border-2 ${statusData.theme} group-hover:border-black group-hover:bg-white w-fit px-[1rem] rounded-full`}
    >
      <p className="text-[0.7rem] md:text-sm group-hover:text-black">
        {statusData.text}
      </p>
    </div>
  );
};

export default StatusLabel;
