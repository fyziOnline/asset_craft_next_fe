'use client';
import React, { useEffect } from 'react';

const EditContentModel = () => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    }

    return (
        <div onClick={handleClick} className="fixed z-[1000] left-0 right-0 top-0 bottom-0 bg-black bg-opacity-55 flex items-center justify-center">
            <div className='w-[90vw] h-[90vh] bg-white rounded-md'></div>
        </div>
    );
};

export default EditContentModel;