import React from 'react';
import TierIcon from '@ui/TierIcon';


const tierLabels: { [key: string]: { name: string; label: string } } = {
  nostradamus: { name: "노스트라다무스", label: "노스트라다무스" },
  novice: { name: "견습생", label: "견습생" },
  oracle: { name: "오라클", label: "오라클" },
  prophet: { name: "예언자", label: "예언자" },
  seer: { name: "초보자", label: "초보자" },
};

interface TierBadgeProps {
  name: string;
}

const TierBadge: React.FC<TierBadgeProps> = ({ name = "" }) => {
  const tier = tierLabels[name] || { name: "Unknown Tier", label: "" };

  return (
    <span className="text-xs bg-slate-200 rounded-full py-0 px-2 cursor-pointer inline-flex items-center justify-center hover:bg-slate-300">
      <TierIcon name={tier.label} size={15}  />
      {tier.name}
    </span>
  );
};

export default TierBadge;
