import { $Enums, Prisma, Rarity, Room } from '@/generated/prisma';
import { categoryColors, rarityColors } from '@/utils/colors';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '../../../../../prisma/prisma';

interface RoomContainerProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

/**
 * Fetch rooms from the database. If a name query is supplied we perform a case-insensitive
 * contains filter on the `name` field.
 */
async function fetchRooms(nameQuery: string) {
  const where: Prisma.RoomWhereInput | undefined = nameQuery
    ? { name: { contains: nameQuery, mode: 'insensitive' }, isSecret: false, category: { not: 'SECRET' } }
    : undefined;

  const rooms = await prisma.room.findMany({
    where,
    select: {
      id: true,
      name: true,
      previewImageUrl: true,
      category: true,
      rarity: true,
      isSecret: true,
      assetUrl: true,
    },
  });

  return rooms.map<Room>((r) => ({
    id: r.id,
    name: r.name,
    previewImageUrl: r.previewImageUrl ?? '/room-previews/placeholder.png',
    category: r.category,
    rarity: r.rarity as Rarity,
    isSecret: r.isSecret,
    assetUrl: r.assetUrl,
  }));
}

const rarityAsc = Object.keys($Enums.Rarity);
const rarityDesc = [...rarityAsc].reverse();

const SecretRoomCard = () => (
  //block w-full aspect-square sm:w-[250px] bg-[#11142d] rounded-lg overflow-hidden hover:scale-[1.02] transition-transform duration-200
  <div className="w-full aspect-square sm:w-[250px] bg-[#0d0c1f] border border-[#23224a] rounded-lg overflow-hidden flex items-center justify-center text-purple-500 text-3xl font-bold tracking-widest select-none shadow-[0_0_15px_#8b5cf6]/40">
    ???
  </div>
);

const RoomCard = ({ room }: { room: Room }) => {
  const { id, name, previewImageUrl, category, rarity } = room;
  return (
    <Link
      href={`/room?id=${id}`}
      className="block w-full aspect-square sm:w-[250px] bg-[#11142d] rounded-lg overflow-hidden hover:scale-[1.02] transition-transform duration-200"
    >
      <div className="flex flex-col h-full w-full">
        <div className="relative flex-1 sm:h-[170px] w-full">
          <Image
            src={previewImageUrl}
            alt={name}
            className="object-cover"
            fill
            sizes="350px"
            quality={90}
          />
        </div>
        <div className="p-2">
          <h3
            className="text-white font-medium text-lg mb-1 truncate"
            title={name}
          >
            {name}
          </h3>
          <div className="flex flex-wrap gap-1">
            {category && (
              <span
                className="text-[10px] font-semibold px-2 py-1 rounded"
                style={{
                  color: categoryColors[category] ?? '#fff',
                  background: `${categoryColors[category] ?? '#fff'}22`,
                }}
              >
                {category[0] + category.slice(1).toLowerCase()}
              </span>
            )}
            {rarity && (
              <span
                className="text-[10px] font-semibold px-2 py-1 rounded"
                style={{
                  color: rarityColors[rarity],
                  background: `${rarityColors[rarity]}22`,
                }}
              >
                {rarity[0] + rarity.slice(1).toLowerCase()}
              </span>
            )}
          </div>
        </div>
      </div>

    </Link>
  );
};

const RoomContainer = async ({ searchParams }: RoomContainerProps) => {
  const nameQueryRaw = searchParams?.room;
  const nameQuery =
    typeof nameQueryRaw === 'string' ? nameQueryRaw.toLowerCase() : '';

  const filterOrder =
    typeof searchParams?.filter === 'string' &&
      searchParams.filter === 'rare_to_common'
      ? 'rare_to_common'
      : 'common_to_rare';

  const rooms = await fetchRooms(nameQuery);

  // Sort rooms by rarity
  rooms.sort((a, b) => {
    const order = filterOrder === 'rare_to_common' ? rarityDesc : rarityAsc;
    return order.indexOf(a.rarity) - order.indexOf(b.rarity);
  });

  // Group by rarity for sectioned display
  const grouped: Record<string, Room[]> = {};
  rooms.forEach((room) => {
    grouped[room.rarity] = grouped[room.rarity]
      ? [...grouped[room.rarity], room]
      : [room];
  });

  const displayOrder =
    filterOrder === 'rare_to_common' ? rarityDesc : rarityAsc;

  return (
    <div className="space-y-10">
      {displayOrder.map((rarityKey) => {
        const sectionRooms = grouped[rarityKey] ?? [];
        if (!sectionRooms.length) return null;
        return (
          <section key={rarityKey}>
            <h2
              className="text-2xl font-bold mb-4 uppercase"
              style={{ color: rarityColors[rarityKey] }}
            >
              {rarityKey[0] + rarityKey.slice(1).toLowerCase()}
            </h2>
            <div className="flex flex-wrap gap-4">
              {rarityKey === 'SECRET'
                ? [...sectionRooms].map((_, idx) => (
                  <SecretRoomCard key={idx} />
                ))
                : sectionRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default RoomContainer;
