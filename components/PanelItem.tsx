"use client";
import React, { useState } from 'react';
import Avatar from '@rd/Avatar';
import { Button } from '@nextui-org/button';
import UserInfo from '@components/UserInfo';
import TierBadge from '@components/TierBadge';

interface Props {
  name: string;
  username: string;
  src: string;
  initials: string;
}

const PanelItem = ({ name, username, src, initials }: Props) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleToggle = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="flex flex-1 items-center gap-x-2 px-4 py-3 hover:bg-slate-200">
      <div className="flex items-center gap-x-2 flex-1">
        <div className="flex-none justify-start">
          <Avatar src={src} alt={name} initials={initials} />
        </div>
        <div className=" flex flex-col ">
          <TierBadge name="nostradamus" />
          <p className="text-base font-semibold">{name}</p>
          <p className="text-sm text-slate-600 font-medium">@{username}</p>
        </div>
      </div>
      <div>
        <Button
          radius="full"
          size="md"
          className="px-4 py-2"
          variant={isFollowing ? 'bordered' : 'solid'}
          color="primary"
          onClick={handleToggle}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>
    </div>
  );
};

export default PanelItem;
