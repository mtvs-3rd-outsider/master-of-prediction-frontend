"use client";
import React, { useState } from 'react';
import Avatar from '@rd/Avatar';
import { Button } from '@nextui-org/button';
import UserInfo from '@components/UserInfo';
import TierBadge from '@components/TierBadge';
import Link from 'next/link';
import useUserStore from '@store/useUserStore';
import useOptimisticMutation from '@handler/useOptimisticMutation';
import apiClient from '@handler/fetch/axios';
interface Props {
  id: string,
  name: string;
  username: string;
  src: string;
  initials: string;
  isUserChannel: boolean;
  following:boolean;

}

const PanelItem = ({ id, name, username, src, initials ,following,isUserChannel}: Props) => {
  const [isFollowing, setIsFollowing] = useState(following);
  const userInfo = useUserStore(state=>state?.userInfo)

  const handleToggle = () => {
    setIsFollowing(!isFollowing);
  };
  let href=null;
if(isUserChannel)
{
   href= `/channel/${id}`
}else{
   href = `/category-channel/${id}`
}

const followMutation = useOptimisticMutation(
  {
    queryKey:["channel-subscribe",id],
    mutationFn:()=> fetchSubscribe(),
    onMutateFn:handleToggle
  }
);
  const fetchSubscribe = async ()=>{
    await apiClient.post("/channel/subscription", { channelId: id, isUserChannel });
  }
  const userId: number | undefined = userInfo?.id;
  return (
  
    <Link href={href}>
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
        {
          (userInfo?.id != undefined && userInfo?.id.toString() != id) &&
          <Button
          radius="full"
          size="md"
          className="px-4 py-2"
          variant={isFollowing ? 'bordered' : 'solid'}
          color="primary"
          onClick={(e) => {
            e.stopPropagation(); // Prevents the event from propagating to the Link
            e.preventDefault(); 
            followMutation.mutate(null);
          }}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
        }
       
      </div>
    </div>
    </Link>
  );
};

export default PanelItem;
