import React from 'react';
import { X } from 'lucide-react';

interface PopupCardProps {
    headerTitle: string;
    children: React.ReactNode;
    submitbutton: React.ReactNode;
    onClose: () => void;
}

const PopupCard: React.FC<PopupCardProps> = ({ headerTitle, children, submitbutton, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="w-full max-w-2xl bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
                    <h1 className="text-xl font-bold text-gray-900">{headerTitle}</h1>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                    >
                        <X className="w-6 h-6 text-teal-600" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>

                {/* Footer - Fixed at bottom */}
                <div className="p-6 flex justify-end flex-shrink-0">
                    {submitbutton}
                </div>
            </div>
        </div>
    );
};

export default PopupCard;