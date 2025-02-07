import React from 'react'
import { MdOutlineClose } from "react-icons/md";


interface PopupCardProps {

    headerTitle: string;
    children: React.ReactNode;
    submitbutton: React.ReactNode;
    onClose: () => void;

}


const PopupCard: React.FC<PopupCardProps> = ({ headerTitle, children, submitbutton, onClose }) => {


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="w-[46%] bg-white rounded-xl shadow-lg" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h1 className="text-xl font-bold">{headerTitle}</h1>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                        <MdOutlineClose color='#00A881' className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">{children}</div>

                {/* Footer */}
                <div className="p-4 flex justify-end">{submitbutton}</div>
            </div>
        </div>
    );
};

export default PopupCard;