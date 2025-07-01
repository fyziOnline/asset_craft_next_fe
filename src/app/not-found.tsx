"use client";

import { FaArrowLeft } from "react-icons/fa6";
import { AiOutlineHome } from "react-icons/ai";
import { useRouter } from "next/navigation";

const NotFound = () => {
    const router = useRouter();

    return (
        <div className="mt-10 h-[75vh] flex flex-col items-center justify-center">
            <div className="text-9xl md:text-9xl font-bold text-teal-500 tracking-wider">
                404
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                Page Not Found
            </h1>

            <p className="text-gray-600 text-xl mb-8 max-w-md mx-auto text-center">
                The page you're looking for doesn't exist or has been moved.
                Let's get you back on track.
            </p>

            <div className="flex justify-center gap-5">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-200 font-medium"
                >
                    <FaArrowLeft size={20} />
                    <span>Go Back</span>
                </button>

                <button
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                    onClick={() => router.push('/dashboard')}
                >
                    <AiOutlineHome size={20} />
                    <span>Dashboard</span>
                </button>
            </div>
        </div>
    )
}

export default NotFound
