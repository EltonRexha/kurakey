'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLinks = () => {
  const pathname = usePathname();
  const navItems = [
    { label: 'Chests', href: '/home' },
    { label: 'Buy Coins', href: '/buy-coins' },
    { label: 'Rooms', href: '/rooms' },
  ];

  const isActive = (href: string) => {
    return pathname?.includes(href);
  };

  return (
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
          {item.label}
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
  );
};

export default NavLinks;
