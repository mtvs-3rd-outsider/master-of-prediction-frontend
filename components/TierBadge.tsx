import React from "react";
import TierIcon from "@ui/TierIcon";

export const tierLabels: { [key: string]: { name: string; label: string; icon: string } } = {
  NOSTRADAMUS: { name: "노스트라다무스", label: "노스트라다무스", icon: "nostradamus" },
  NOVICE: { name: "견습생", label: "견습생", icon: "novice" },
  ORACLE: { name: "오라클", label: "오라클", icon: "oracle" },
  PROPHET: { name: "예언자", label: "예언자", icon: "prophet" },
  SEER: { name: "초보자", label: "초보자", icon: "seer" },
};

interface TierBadgeProps {
  name: string;
}

const TierBadge: React.FC<TierBadgeProps> = ({ name = "" }) => {
  const tier = tierLabels[name];
  return (
    <span className="text-xs bg-slate-200 rounded-full py-0 px-2 cursor-pointer inline-flex items-center justify-center hover:bg-slate-300">
      {tier && <TierIcon name={tier.icon} size={15} />}
      {tier ? tier.name : "UNRANKED"}
    </span>
  );
};

export default TierBadge;
