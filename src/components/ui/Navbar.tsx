import Image from 'next/image';
import Link from 'next/link';
import { FaDiscord } from 'react-icons/fa';
import HorizontalCarousel from './common/HorizontalCarousel';
import XLogo from './common/XLogo';
import Card from './common/CarouselCard';
import NavLinks from './common/NavLinks';
import GetServerUser from '../../../libs/GetServerUser';
import coinIcon from '@/assets/images/icons/coin.png';
import prisma from '../../../prisma/prisma';

async function getRooms() {
  return prisma.room.findMany({
    where: { isSecret: false },
    select: {
      id: true,
      name: true,
      previewImageUrl: true,
      category: true,
      rarity: true,
    },
    orderBy: { name: 'asc' },
  });
}

const Navbar = async () => {
  const rooms = await getRooms();

  const user = await GetServerUser();

  if (!user) {
    throw new Error('User not found');
  }

  const profileImage = user.image || '/placeholder-avatar.png';

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
                sizes="120px"
                className="h-14 w-auto"
              />
            </Link>
            <div className=" items-center space-x-4 hidden sm:flex">
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
          {/* Navigation Links - Now a client component */} <NavLinks />
          {/* User Info Section */}
          <div className="flex items-center gap-4">
            {/* Coin Balance */}
            <div className="flex items-center gap-1.5">
              <p className="text-emerald-500 font-medium">{user.coinBalance}</p>{' '}
              <Image
                src={coinIcon}
                alt="Coins"
                width={20}
                height={20}
                sizes="20px"
                className="object-contain"
              />
            </div>

            {/* Profile Image */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#008cff]/50">
              <Image
                src={profileImage}
                alt="User Profile"
                fill
                priority
                sizes="32px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="py-2">
          <HorizontalCarousel>
            {rooms.map((room) => (
              <Card
                key={room.id}
                title={room.name}
                image={room.previewImageUrl}
                category={room.category}
                rarity={room.rarity}
                id={room.id}
              />
            ))}
          </HorizontalCarousel>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
