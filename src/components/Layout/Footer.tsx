import { HPE_Logo } from "@/assets/icons/HPE_Logo"
import Link from "next/link"

interface FooterLink {
    label: string
    href: string
    id: string
  }
  
  const footerLinks: FooterLink[] = [
    {
      label: 'Privacy',
      href: '/',
      id:'privacy'
    },
    {
      label: 'Terms of Use',
      href: '/',
      id:'terms'
    },
    {
      label: 'Ad Choice & Cookies',
      href: '/',
      id:'choice&cookie'
    },
    {
      label: 'Sitemap',
      href: '/',
      id:'sitemap'
    }
  ]

const Footer:React.FC = () => {
  return (
    <footer className="fixed right-0 left-0 bottom-0 z-40 bg-off-white-primary px-[2.5rem] py-[2rem]">
        <div className="flex justify-between align-bottom">
            <p className="text-xs">© Copyright 2024 Hewlett Packard Enterprise Development LP</p>
            <div className="flex gap-[7px]">
                {footerLinks.map((link,index) => (
                    <div key={link.id} >
                        <Link href={link.href} className="text-xs">{link.label}</Link>
                        {index < footerLinks.length-1 && <span className="ml-[7px]">|</span>}
                    </div>
                ))}
            </div>
        </div>
        <div className="flex justify-center">
            <HPE_Logo />
        </div>
    </footer>
  )
}

export default Footer