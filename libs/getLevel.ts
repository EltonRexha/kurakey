const Levels: Record<number, { xp: number }> = {
  1: { xp: 0 },
  2: { xp: 100 },
  3: { xp: 150 },
  4: { xp: 200 },
  5: { xp: 300 },
  6: { xp: 400 },
  7: { xp: 500 },
  8: { xp: 600 },
  9: { xp: 700 },
  10: { xp: 800 },
};

export const getLevel = (xp: number) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const level = Object.entries(Levels).find(([_, level]) => level.xp >= xp);
  if (xp > Levels[10].xp) return 10;
  return level?.[0] || 1;
};

export default getLevel;
