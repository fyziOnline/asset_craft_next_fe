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
    id: 'privacy'
  },
  {
    label: 'Terms of Use',
    href: '/',
    id: 'terms'
  },
  {
    label: 'Ad Choice & Cookies',
    href: '/',
    id: 'choice&cookie'
  },
  {
    label: 'Sitemap',
    href: '/',
    id: 'sitemap'
  }
  
]

interface FooterProps {
  footerPosition?: string
}

// Get get environment variable from .env file to display the git version id
const gitLabel = process.env.NEXT_PUBLIC_GIT_VERSION_ID ? `${process.env.NEXT_PUBLIC_GIT_VERSION_ID}` : ''

const Footer: React.FC<FooterProps> = ({footerPosition = 'fixed'}) => {
  return (
    <footer className={`${footerPosition} right-0 left-0 bottom-0 z-50 bg-off-white-primary px-[2.5rem] py-[1.8rem] padbot15 md:pb-[0.75rem] padfooter`}>
      <div className="md:flex justify-between items-center">
        <p className="text-xs text-center">© Copyright 2025 Hewlett Packard Enterprise Development LP <span className="text-xs text-gray-400">{gitLabel}</span></p>
        <div className="flex gap-[7px] justify-center">
          {footerLinks.map((link, index) => (
            <div key={link.id} >
              <Link href={link.href} className="text-xs">{link.label}</Link>
              {index < footerLinks.length - 1 && <span className="ml-[7px]">|</span>}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer