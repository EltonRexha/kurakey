import Link from 'next/link';
import { FaDiscord } from 'react-icons/fa';
import XLogo from './common/XLogo';

const Footer = () => {
  const navigation = [
    {
      title: 'Navigation',
      links: [
        { name: 'Cases', href: '/home/chests' },
        { name: 'Buy coins', href: '/home/buycoins' },
        { name: 'Rooms', href: '/home/Rooms' },
      ],
    },
    {
      title: 'Information',
      links: [
        { name: 'Terms of service', href: '/terms' },
        { name: 'Privacy policy', href: '/privacy' },
        { name: 'About us', href: '/about' },
      ],
    },
    {
      title: 'Help',
      links: [{ name: 'Support', href: '/support' }],
    },
  ];

  return (
    <footer className="bg-[#191838] border-t border-[#11142d] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Social Section */}
          <div className="space-y-6">
            <Link href="/home" className="flex-shrink-0">
              <img src="/logo.png" alt="Kurakey" className="h-12 w-auto" />
            </Link>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-neutral-500 hover:text-[#008cff] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <XLogo className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-[#008cff] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDiscord className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Sections */}
          {navigation.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-[#008cff] font-semibold text-lg">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-neutral-400 hover:text-[#008cff] transition-colors footer-glow-link"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
