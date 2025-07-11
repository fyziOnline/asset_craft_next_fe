import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import ProgressionIndicator from "../elements/ProgressionIndicator";
import { Spaces } from "../space/_index";

const NestedSlidingSections = ({ setNestedInfoIndex,hObj}: { setNestedInfoIndex:(type:number)=>void,hObj:{hH:number,hF:number}}) => {
  const [currentSection, setCurrentSection] = React.useState(0);

  const nestedSections = [
    {
      id: 1,
      title: "Campaign Details",
      description : 'Please provide the necessary information about the campaign you are planning',
      component: <Spaces.CampaignDetails />,
      // bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100"
    },
    {
      id: 2,
      title: "Asset Details",
      description : 'Please provide the necessary information to generate the asset, * fields are mandatory',
      component: <Spaces.AssetDetails />,
      // bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100"
    },
    {
      id: 3,
      title: "Reviews",
      description : 'Please review the information you just provide, Feel free to edit them by moving to previous slide',
      component: <Spaces.ReviewSection />,
      // bgColor: "bg-gradient-to-br from-green-50 to-emerald-100"
    }
  ];

  const goToNext = () => {
    if (currentSection < nestedSections.length - 1) {
      setCurrentSection(currentSection + 1);
      setNestedInfoIndex(currentSection + 1)
    }
  };

  const goToPrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setNestedInfoIndex(currentSection - 1)
    }
  };

  return (
    <div className="relative w-full overflow-y-auto overflow-x-clip scroll-smooth rounded-lg">
      {/* Sliding Container */}
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSection * 100}%)` }}
      >
        {nestedSections.map((section, index) => (
          //  ${section.bgColor}
          <div
            key={section.id}
            className={`w-full flex-shrink-0 flex items-baseline justify-center 
               relative`}
            style={{ height: `calc(100vh - ${hObj.hF+hObj.hH+115}px)` }}
          >
            {/* Section component */}
            <div className="w-full mx-auto px-10 text-center h-[90%]">
              <div className="text-lg text-gray-600 leading-relaxed mb-6 bg-white mt-4 rounded-3xl overflow-y-auto"
                   style={{height:'inherit'}}
              >
                {section.component}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Navigation Buttons - Outside sliding container */}
      <div className='absolute bottom-[4%] flex w-full justify-between px-12 items-center flex-row-reverse'>
        <div className="transform -translate-x-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110 z-10 flex">
          <button 
            onClick={goToPrevious}
            disabled={currentSection === 0}
            className={`p-1 rounded-full transition-colors duration-200 ${
              currentSection === 0 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={goToNext}
            disabled={currentSection === nestedSections.length - 1}
            className={`p-1 rounded-full transition-colors duration-200 ${
              currentSection === nestedSections.length - 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <ProgressionIndicator currentSection={currentSection}/>
      </div>
    </div>
  );
};

export default NestedSlidingSections