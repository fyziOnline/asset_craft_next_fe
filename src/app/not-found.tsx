"use client";

import { FaArrowLeft, FaGhost } from "react-icons/fa6";
import { AiOutlineHome } from "react-icons/ai";
import { useRouter } from "next/navigation";

const NotFound = () => {
    const router = useRouter();

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-50 text-gray-800 p-4 overflow-hidden relative">
                <div className="relative z-10 text-center flex flex-col items-center">

                    <h1 className="text-8xl md:text-9xl font-black text-gray-700 mt-8">
                        Oops!
                    </h1>
                    <p className="text-5xl md:text-6xl font-bold text-teal-500 mt-2">404</p>

                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 mt-8">
                        You're lost in the void.
                    </h2>

                    <p className="text-md md:text-lg text-gray-500 mt-4 mb-8 max-w-md mx-auto">
                        The page you are looking for seems to have vanished into thin air.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-200 font-medium"
                        >
                            <FaArrowLeft size={18} />
                            <span>Go Back</span>
                        </button>

                        <button
                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                            onClick={() => router.push('/dashboard')}
                        >
                            <AiOutlineHome size={20} />
                            <span>Go to Dashboard</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFound;