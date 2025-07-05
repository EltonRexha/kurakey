import { TradeChest } from '../../../../../libs/api/trade';

// helper to aggregate chests by type name
export default function aggregateChests(chests: TradeChest[]) {
  const map = new Map<string, { name: string; count: number; id: string }>();
  chests.forEach((c) => {
    const key = c.type.name;
    const entry = map.get(key) ?? { name: key, count: 0, id: c.id };
    entry.count += 1;
    map.set(key, entry);
  });
  return Array.from(map.values()).map((c) => ({
    type: 'chest' as const,
    data: { name: c.name, count: c.count, id: c.id },
  }));
}
