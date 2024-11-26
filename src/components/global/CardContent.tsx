import { FC } from "react"

interface ContentProp {
    header : string
    content : string
    cardClass ?: string
}

const CardContent:FC<ContentProp>= ({header,content,cardClass}) => {
  return (
    <section className={`${cardClass}`}>
        <h2 className="font-medium text-[1rem] md:text-[1.3rem]  text-grey-800 group-hover:text-white mb-1">{header}</h2>
        <p className="text-xs sm:text-[1rem] leading-6 xl:leading-7 text-grey-500 group-hover:text-white line-clamp-3">{content}</p>
    </section>
  )
}

export default CardContent