import { FC } from "react";

export const NotFound: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[68vh] text-center relative">
      {/* Container for Folder and Lens */}
      <div className="relative w-[220px] h-[172px]">
        {/* Folder Background */}
        <svg
          width="220"
          height="172"
          viewBox="0 0 220 172"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="folder-icon"
        >
          <g clipPath="url(#clip0)">
            <rect
              x="132.682"
              y="16"
              width="70.3137"
              height="85.8312"
              transform="rotate(23.1057 132.682 16)"
              fill="white"
            />
            <rect
              width="55.8175"
              height="52.7887"
              transform="translate(137.686 24.6581) rotate(23.1057)"
              fill="url(#paint0_linear)"
            />
          </g>
          <rect
            x="133.209"
            y="17.3122"
            width="68.3137"
            height="83.8312"
            transform="rotate(23.1057 133.209 17.3122)"
            stroke="#00A881"
            strokeOpacity="0.49"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="paint0_linear" x1="27.9088" y1="0" x2="27.9088" y2="52.7887" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00A881" />
              <stop offset="1" stopColor="#00A881" stopOpacity="0.14" />
            </linearGradient>
            <clipPath id="clip0">
              <rect
                x="132.682"
                y="16"
                width="70.3137"
                height="85.8312"
                transform="rotate(23.1057 132.682 16)"
                fill="white"
              />
            </clipPath>
          </defs>
        </svg>

        {/* Search Lens with Animation */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00A881"  // Set stroke color to #00A881
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="search-lens absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Not Found Text */}
      <h1 className="text-3xl font-semibold text-gray-700 mt-4">Image Not Found</h1>
      <p className="text-gray-500 mt-2">Sorry, we couldn't find the image you were looking for.</p>
    </div>
  );
};

export default NotFound;
