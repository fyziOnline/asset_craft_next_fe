'use client';
import React from 'react';

interface ChildrenTitleProps {
    title: string;
    customClass?: string;
    showStar?: boolean;
}

const ChildrenTitle: React.FC<ChildrenTitleProps> = ({ title = "", customClass = "", showStar = false }) => {
    return (<p className={`font-semibold text-[#160647] text-base tracking-[0] leading-5 text-wrap whitespace-nowrap mb-[12px] ${customClass}`}>{title} {showStar && <span className="text-red-500">*</span>}</p>)
}

export default ChildrenTitle;
