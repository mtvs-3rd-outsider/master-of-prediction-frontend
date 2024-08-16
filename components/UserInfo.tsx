import React from 'react';
import TierBadge from '@ui/TierBadge';

interface UserInfoProps {
  name: string;
  username: string;
  date: string;
  tierName: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ name, username, date, tierName }) => {
  return (
    <div className="flex flex-1 gap-x-1 text-sm items-center">
      <span className="text-slate-900 font-bold">{name}</span>
      <span className="text-slate-600 font-medium">@{username}</span>
      <span className="text-slate-600 font-medium">·</span>
      <span className="text-slate-600 font-medium">{date}</span>
      <TierBadge name={tierName} />
    </div>
  );
};

export default UserInfo;
