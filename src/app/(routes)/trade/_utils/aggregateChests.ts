import { TradeChest } from '../../../../../libs/api/trade';

export interface AggregatedChest {
  type: 'chest';
  data: {
    name: string;
    count: number;
    id: string;
    chestTypeId: string;
    chestImageUrl: string;
  };
}

// helper to aggregate chests by type name
export default function aggregateChests(
  chests: TradeChest[]
): AggregatedChest[] {
  const map = new Map<
    string,
    { name: string; count: number; id: string; chestTypeId: string; chestImageUrl: string }
  >();
  chests.forEach((c) => {
    const key = c.type.name;
    const entry = map.get(key) ?? {
      name: key,
      count: 0,
      id: c.id,
      chestTypeId: c.type.id,
      chestImageUrl: c.type.chestImageUrl,
    };
    entry.count += 1;
    map.set(key, entry);
  });
  return Array.from(map.values()).map((c) => ({
    type: 'chest' as const,
    data: {
      name: c.name,
      count: c.count,
      id: c.id,
      chestTypeId: c.chestTypeId,
      chestImageUrl: c.chestImageUrl,
    },
  }));
}
