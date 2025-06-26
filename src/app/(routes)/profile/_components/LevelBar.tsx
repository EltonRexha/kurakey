"use client";

interface LevelBarProps {
  level: number;
  xp: number;
  nextLevelXp: number;
  isMax: boolean;
}

const LevelBar: React.FC<LevelBarProps> = ({ level, xp, nextLevelXp, isMax }) => {
  const percent = isMax ? 100 : Math.min(100, (xp / nextLevelXp) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-neutral-300 mb-1">
        <span>Level {level}</span>
        {isMax ? (
          <span className="text-yellow-400 font-semibold">MAX</span>
        ) : (
          <span>
            {xp}/{nextLevelXp} XP
          </span>
        )}
      </div>
      <div className="h-3 bg-[#1c1b35] rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#008cff] to-[#00e0ff] h-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default LevelBar;
