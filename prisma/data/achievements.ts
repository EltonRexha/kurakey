interface AchievementSeed {
  type: string;
  image: string;
  unlockMessage: string;
}

const achievements: AchievementSeed[] = [
  {
    type: 'chestOpener',
    image: '/achievements/chestOpener.png',
    unlockMessage: 'The journey begins',
  },
  {
    type: 'roomExplorer',
    image: '/achievements/roomExplorer.png',
    unlockMessage: "You've seen more than most.",
  },
  {
    type: 'luckDrop',
    image: '/achievements/luckDrop.png',
    unlockMessage: 'Not everyone pulls a room like that.',
  },
  {
    type: 'voidBorn',
    image: '/achievements/voidBorn.png',
    unlockMessage: "You've touched the edge of the unknown.",
  },
  {
    type: 'realityBreaker',
    image: '/achievements/realityBreaker.png',
    unlockMessage: "You didn't just peek beyond the veil - you shattered it.",
  },
  {
    type: 'secretWitness',
    image: '/achievements/secretWitness.png',
    unlockMessage: "What you saw wasn't meant for everyone.",
  },
];

export default achievements;
