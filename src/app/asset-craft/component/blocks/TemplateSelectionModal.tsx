'use client'
import { Template } from '@/types/templates'
import { X } from 'lucide-react'
import React, { FC, useEffect, useRef } from 'react'

type TemplateSelectionModalProp = {
        type : string | null
        loading : boolean
        isOpen : boolean
        closeModal : React.Dispatch<React.SetStateAction<boolean>>
        templates : Template[]|null
        handelTemplateSelection : (id:string,name:string) => void
    }

const TemplateSelectionModal:FC <TemplateSelectionModalProp> = ({type,loading,isOpen,closeModal,templates,handelTemplateSelection}) => {
  const modalRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal(false);
    }
  };  
  document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div ref={modalRef}  className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90%] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Select a Template for {type}
          </h2>
          <button
            onClick={()=>closeModal(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            <X className="w-6 h-6 text-teal-600" />
            {/* <XCircle size={24} /> */}
          </button>
        </div>
        <div className="p-6 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {/* <Search className="h-5 w-5 text-gray-400" /> */}
            </div>
            {/* <Input
              id="template-search"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            /> */}
          </div>
        </div>
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {templates?.map((template) => (
                  <div
                    key={template.assetTypeID}
                    onClick={() => {
                      handelTemplateSelection(template.templateID || "" ,template.templateName || "");
                    //   onClose();
                    }}
                    className="cursor-pointer border rounded-lg overflow-hidden group hover:shadow-lg hover:border-[#01A982] transition-all"
                  >
                    <img
                      src={template.templateImageURL}
                      alt={template.templateName}
                      className="w-full h-auto object-cover bg-gray-100"
                    />
                    <div className="p-3 text-center text-sm font-semibold text-gray-800 group-hover:bg-[#01A982] group-hover:text-white transition-colors">
                      {template.templateName}
                    </div>
                  </div>
                ))}
                {templates && templates?.length === 0 && (
                  <p className="text-center text-gray-500 mt-4">
                    No templates found.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TemplateSelectionModal