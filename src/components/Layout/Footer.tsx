import Link from "next/link"

interface FooterLink {
  label: string;
  href: string;
  id: string;
}

const footerLinks: FooterLink[] = [
  { label: 'Privacy', href: '/', id: 'privacy' },
  { label: 'Terms of Use', href: '/', id: 'terms' },
  { label: 'Ad Choice & Cookies', href: '/', id: 'choice&cookie' },
  { label: 'Sitemap', href: '/', id: 'sitemap' }
];

interface FooterProps {
  footerPosition?: string
}

// Get get environment variable from .env file to display the git version id
const gitLabel = process.env.SHOW_GIT_VERSION === 'true' 
  ? `${process.env.ENVIRONMENT || ''} ${process.env.NEXT_PUBLIC_GIT_VERSION_ID || ''}`.trim()
  : ''

const Footer: React.FC<FooterProps> = ({footerPosition = 'fixed'}) => {
  return (
    <footer id="brand_lab-ftr" className={`${footerPosition} right-0 left-0 bottom-0 z-50 bg-off-white-primary px-16 py-3 padbot15 padfooter`}>
      <div className="md:flex justify-between items-center">
        <p className="text-xs text-center">
          © Copyright 2025 Hewlett Packard Enterprise
          {gitLabel && <span className="text-xs text-gray-400 ml-1">{gitLabel}</span>}
        </p>
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