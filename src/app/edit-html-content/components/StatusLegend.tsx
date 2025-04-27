import React from 'react';

// Define status color mapping
export const statusColors: Record<string, string> = {
    "In Progress": "#2196F3", // Blue
    "On Review": "#FF9800", // Orange
    "Completed": "#4CAF50", // Green
};

interface StatusLegendProps {
    statusList: string[];
}

const StatusLegend: React.FC<StatusLegendProps> = ({ statusList }) => {
    // If no statuses are available, don't render the component
    if (statusList.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center space-x-4 p-2">
            <div className='text-base tracking-wide'>Legend :</div>
            {statusList.map((status) => (
                <div key={status} className="flex items-center">
                    <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: statusColors[status] || "#9E9E9E" }}
                    />
                    <span className="text-sm text-gray-700">{status}</span>
                </div>
            ))}
        </div>
    );
};

export default StatusLegend; 