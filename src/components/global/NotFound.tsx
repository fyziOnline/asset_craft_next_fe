import { FC } from "react"


interface NotFoundProps {
    statusCode?: number
    title?: string
    description?: string
}

const NotFound: FC<NotFoundProps> = ({ statusCode = 404, title = "Page Not Found", description }) => {
    return (
        <div className='fixed inset-0 flex flex-col items-center justify-center bg-white z-[1000]'>
            <h1 className="text-6xl font-bold">{statusCode}</h1>
            <p className="text-xl mt-4">{title}</p>
            <p className="mt-2 text-gray-500">{description}</p>
        </div>
    )
}

export default NotFound