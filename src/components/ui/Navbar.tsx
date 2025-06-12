'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaDiscord } from 'react-icons/fa';
import HorizontalCarousel from './common/HorizontalCarousel';
import XLogo from './common/XLogo';
import Card from './common/CarouselCard';

const Navbar = ({ profileImageUrl }: { profileImageUrl?: string | null }) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Chests', href: '/chests' },
    { label: 'Buy Coins', href: '/buy' },
    { label: 'Rooms', href: '/rooms' },
  ];
  const sampleCards = [
    { title: 'Room1', image: '/example.jpg' },
    { title: 'Room2', image: '/example.jpg' },
    { title: 'Room3', image: '/example.jpg' },
    { title: 'Room4', image: '/example.jpg' },
    { title: 'Room5', image: '/example.jpg' },
  ];

  const isActive = (href: string) => {
    return pathname?.includes(href);
  };

  const profileImage = profileImageUrl || '/placeholder-avatar.png'; // Provide a default image path

  return (
    <nav className="bg-[#191838] border-b border-[#11142d] py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Social Links */}
          <div className="flex items-center space-x-6">
            <Link href="/home" className="flex-shrink-0">
              {' '}
              <Image
                src="/logo.png"
                alt="Kurakey"
                width={100}
                height={48}
                className="h-14 w-auto"
              />
            </Link>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-neutral-500 hover:text-[#008cff] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <XLogo className="w-4 h-4" />
              </a>{' '}
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

          {/* Navigation */}
          <div className="hidden md:flex items-center mr-20 space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`relative font-semibold transition-colors group ${
                  isActive(item.href)
                    ? 'text-[#008cff]'
                    : 'text-neutral-300 hover:text-[#008cff]'
                }`}
              >
                {item.label}{' '}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r bg-[#008cff] transform transition-transform duration-300 ${
                    isActive(item.href)
                      ? 'scale-x-100 shadow-[0_0_10px_#008cff,0_0_30px_#008cff,0_0_50px_#008cff]'
                      : 'scale-x-0 group-hover:scale-x-100 group-hover:shadow-[0_0_10px_#008cff,0_0_30px_#008cff,0_0_50px_#008cff]'
                  }`}
                ></span>
              </Link>
            ))}
          </div>

          {/* Profile Image */}
          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#008cff]/50">
            <Image
              src={profileImage}
              alt="User Profile"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Carousel Section */}
        <div className="py-2">
          <HorizontalCarousel>
            {sampleCards.map((card, index) => (
              <Card key={index} title={card.title} image={card.image} />
            ))}
          </HorizontalCarousel>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
