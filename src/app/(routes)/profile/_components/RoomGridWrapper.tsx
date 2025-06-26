import prisma from "../../../../../prisma/prisma";
import RoomGrid from "./RoomGrid";
import { $Enums, Rarity, Room, RoomCategory } from "@/generated/prisma";

interface RoomGridWrapperProps {
  userId: string;
}

//Function that takes rooms and orders by rarity
function orderByRarity(rooms: Room[]) {
  return rooms.sort((a, b) => {
    const rarityOrder: Record<$Enums.Rarity, number> = {
      SECRET: 1,
      LEGENDARY: 2,
      EPIC: 3,
      RARE: 4,
      COMMON: 5,
      UNCOMMON: 6,
    };
    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  });
}

async function getUserRooms(userId: string) {
  const userRooms = await prisma.userRoom.findMany({
    where: {
      userId,
      room: { isSecret: false, category: { not: "SECRET" } },
    },
    include: {
      room: true,
    },
  });

  return orderByRarity(userRooms.map((ur) => ur.room));
}

export default async function RoomGridWrapper({
  userId,
}: RoomGridWrapperProps) {
  const rooms = await getUserRooms(userId);
  const roomMap: Record<
    string,
    {
      id: string;
      name: string;
      image: string;
      rarity: Rarity;
      category: RoomCategory;
      count: number;
    }
  > = {};

  rooms.forEach((room) => {
    const { id, name, previewImageUrl, rarity, category } = room;
    if (!roomMap[id]) {
      roomMap[id] = {
        id,
        name,
        image: previewImageUrl,
        rarity,
        category,
        count: 0,
      };
    }
    roomMap[id].count += 1;
  });

  return <RoomGrid rooms={Object.values(roomMap)} />;
}
