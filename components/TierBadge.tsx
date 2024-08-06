import React from 'react';
import TierIcon from '@ui/TierIcon';

interface TierBadgeProps {
  name: string;
  label: string;
}

const TierBadge: React.FC<TierBadgeProps> = ({ name, label }) => {
  return (
    <span className="text-xs bg-slate-200 rounded-full py-0 px-2 cursor-pointer inline-flex items-center justify-center hover:bg-slate-300">
      <TierIcon name={name} size={15} className="mr-1 px-2" />
      {label}
    </span>
  );
};

export default TierBadge;
