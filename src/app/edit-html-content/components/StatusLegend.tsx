import React from 'react';

export const statusColors: Record<string, string> = {
  "In Progress": "#2196F3", // Blue
  "On Review": "#FF9800", // Orange
  "Completed": "#4CAF50", // Green
};

interface StatusLegendProps {
  statusList: string[];
}

const StatusLegend: React.FC<StatusLegendProps> = ({ statusList }) => {
  if (statusList.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center">
      <span className="text-xs uppercase tracking-wider text-gray-500 mr-2">Legend:</span>
      <div className="flex">
        {statusList.map((status) => {
          const color = statusColors[status] || "#9E9E9E";
          return (
            <div 
              key={status}
              className="px-3 py-1 rounded-md text-xs font-medium mx-1 transition-all hover:scale-105"
              style={{ 
                backgroundColor: `${color}20`, // Using hex with 20% opacity
                color: color,
                border: `1px solid ${color}40`
              }}
            >
              {status}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusLegend;