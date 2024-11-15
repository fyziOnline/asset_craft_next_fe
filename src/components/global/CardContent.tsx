import { FC } from "react"

interface ContentProp {
    header : string
    content : string
    cardClass ?: string
}

const CardContent:FC<ContentProp>= ({header,content,cardClass}) => {
  return (
    <section className={`${cardClass}`}>
        <h2 className="font-medium text-[1.5rem] text-grey-800 group-hover:text-white mb-3">{header}</h2>
        <p className="text-grey-500 group-hover:text-white line-clamp-3">{content}</p>
    </section>
  )
}

export default CardContent