'use client'
import React, { useEffect, useState } from 'react'

import { useAssetCraftStoreSelector } from '@/store/assetCraftStore';
import NestedSlidingSections from './component/canvas/NestedSlidingSections';


export interface FormDataProps {
    product?: string,
    campaignGoal?: string,
    targetAudience?: string,
    outputScale?: number,
    topic?: string,
    tone ?:string
    type?: string,
    keyPoints?: string,
    fileSelected?: File,
    webUrl?: string
    fileName?:string
}


const ComponentWithSideBySide = () => {
  const [nestedInfoIndex,setNestedInfoIndex] = useState<number>(0)
  // const [offsetHeight,setOffsetHeight] = useState<number>(0)
  const [heightOfHeaderAndFooter,setHeightOfHeaderAndFooter] = useState<{hH:number,hF:number}>({
    hH:0,
    hF:0
  })

  const template = useAssetCraftStoreSelector.use.template()  


  const calculateHeight = () => {
    const div1 = document.getElementById('app_header');
    const div2 = document.getElementById('brand_lab-ftr');
    
    if (div1 && div2) {
      setHeightOfHeaderAndFooter({
        hH: div1.offsetHeight,
        hF: div2.offsetHeight
      })
    } else {
      console.warn('One or both divs not found');
      return 0;
    }
  }

   useEffect(() => {
    calculateHeight();
    
    const handleResize = () => {
      calculateHeight();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // const assetType = useAssetCraftStoreSelector.use.assetType()  
  const nestedSlidesInformation = [
    {
      id:1,
      title: "Campaign Details",
      description : 'Please provide the necessary information about the campaign you are planning'},
    {
      id: 2,
      title: "Asset Details",
      description : 'Please provide the necessary information to generate the asset, * fields are mandatory',
    },
    {
      id: 3,
      title: "Reviews",
      description : 'Please review the information you just provide, Feel free to edit them by moving to previous slide',
    }
  ]

  return (
    <div className="w-full flex overflow-y-clip mt-3" style={{height:`calc(100vh - ${heightOfHeaderAndFooter.hF+heightOfHeaderAndFooter.hH}px`}}>
      {/* Left Section - 4/7 width - Contains nested sliding component */}
      <div className="w-[65%] h-full bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">{nestedSlidesInformation[nestedInfoIndex].title}</h2>
          <p className="text-gray-600 mt-2">{nestedSlidesInformation[nestedInfoIndex].description}</p>
        </div>
        <div className="flex-1 overflow-auto ">
          <NestedSlidingSections setNestedInfoIndex={setNestedInfoIndex} hObj={heightOfHeaderAndFooter}/>
        </div>
      </div>

      {/* Right Section - 3/7 width */}
      <div className="w-[35%] bg-white flex flex-col items-center justify-center p-8 overflow-y-auto">
        {template ? (
            <div className="max-w-md text-center h-full">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {template.templateName}
                </h3>
                {template.templateImageURL && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={template.templateImageURL} alt={template.templateName || 'Template Image'} className="rounded-lg shadow-lg mb-6" />
                )}
                <p className="text-gray-600 leading-relaxed mb-6">
                    {template.description}
                </p>
            </div>
        ) : (
            <div className="max-w-md text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-3 drop-shadow-sm">
                    Please Select Template
                </h3>
                <p className="text-gray-400 text-sm tracking-wide">
                    Select a template to preview
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

function page() {
  return (
    <div>
      <ComponentWithSideBySide
      />
    </div>
  )
}

export default page