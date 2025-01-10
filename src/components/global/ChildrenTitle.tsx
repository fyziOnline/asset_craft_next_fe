'use client';
import React from 'react';

interface ChildrenTitleProps {
    title: string;
    customClass?: string;
}

const ChildrenTitle: React.FC<ChildrenTitleProps> = ({ title = "", customClass = "" }) => {
    return (<p className={`font-semibold text-[#160647] text-base tracking-[0] leading-5 text-wrap whitespace-nowrap mb-[12px] ${customClass}`}>{title}</p>)
}

export default ChildrenTitle;
