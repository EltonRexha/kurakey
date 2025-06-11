'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaDiscord } from 'react-icons/fa';
import HorizontalCarousel from './common/HorizontalCarousel';
import XLogo from './common/XLogo';
import Card from './common/CarouselCard';

const Navbar = () => {
  const navItems = [
    { label: 'Cases', href: '/cases' },
    { label: 'Buy', href: '/buy' },
    { label: 'Rooms', href: '/rooms' },
  ];
  const sampleCards = [
    { title: 'Room1', image: '/example.jpg' },
    { title: 'Room2', image: '/example.jpg' },
    { title: 'Room3', image: '/example.jpg' },
    { title: 'Room4', image: '/example.jpg' },
    { title: 'Room5', image: '/example.jpg' },
  ];

  return (
    <nav className="bg-[#191838] border-b border-[#11142d] py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/home" className="flex-shrink-0">
            {' '}
            <Image
              src="/logo.png"
              alt="Kurakey"
              width={180}
              height={48}
              className="h-14 w-auto"
            />
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative font-semibold text-neutral-300 hover:text-[#008cff] transition-colors group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#008cff] to-[#11142d] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:shadow-[0_0_10px_#008cff,0_0_20px_#191838]"></span>
              </Link>
            ))}
          </div>

          {/* Social Links & Sign In */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="#"
                className="text-neutral-500 hover:text-[#008cff] transition-colors"
              >
                <XLogo className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-[#008cff] transition-colors"
              >
                <FaDiscord className="w-5 h-5" />
              </a>
            </div>
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
