'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';
import HorizontalCarousel from './common/HorizontalCarousel';
import Card from './common/Card';

const Navbar = () => {
  const navItems = [
    { label: 'Cases', href: '/cases' },
    { label: 'Buy', href: '/buy' },
    { label: 'Rooms', href: '/rooms' },
  ];

  const sampleCards = [
    { title: 'Desert Eagle', image: '/cases/deagle.jpg', price: '$299.99' },
    { title: 'AK-47', image: '/cases/ak47.jpg', price: '$599.99' },
    { title: 'M4A4', image: '/cases/m4a4.jpg', price: '$499.99' },
    { title: 'AWP', image: '/cases/awp.jpg', price: '$899.99' },
    {
      title: 'Butterfly Knife',
      image: '/cases/butterfly.jpg',
      price: '$1299.99',
    },
  ];

  return (
    <nav className="bg-[#191838] border-b border-[#11142d] py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
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
                className="relative text-neutral-400 hover:text-[#008cff] transition-colors group"
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
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-[#008cff] transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-[#008cff] transition-colors"
              >
                <FaDiscord className="w-5 h-5" />
              </a>
            </div>
            <Link
              href="/log-in"
              className="bg-transparent border border-[#008cff] text-[#008cff] hover:bg-gradient-to-r hover:from-[#008cff] hover:to-[#764ba2] hover:border-transparent hover:text-white px-4 py-2 rounded-lg transition-all hover:shadow-[0_0_10px_#008cff,0_0_30px_#764ba2]"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="py-2">
          <HorizontalCarousel>
            {sampleCards.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                image={card.image}
                price={card.price}
              />
            ))}
          </HorizontalCarousel>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
