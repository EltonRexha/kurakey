import { TradeRoom } from '../../../../../libs/api/trade';

export default function aggregateRooms(rooms: TradeRoom[]) {
  const map = new Map<
    string,
    { room: TradeRoom['room']; count: number; id: string }
  >();
  rooms.forEach((ur) => {
    const key = ur.room.id;
    const entry = map.get(key) ?? { room: ur.room, count: 0, id: ur.id };
    entry.count += 1;
    map.set(key, entry);
  });
  return Array.from(map.values()).map((r) => ({
    type: 'room' as const,
    data: {
      name: r.room.name,
      image: r.room.previewImageUrl,
      rarity: r.room.rarity,
      category: r.room.category,
      count: r.count,
      id: r.id,
      roomId: r.room.id,
    },
  }));
}
