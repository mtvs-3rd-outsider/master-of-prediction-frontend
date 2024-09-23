"use client";
import React, { useState } from 'react';
import DropdownMenuDemo from '@rd/DropdownMenu';
import HoverCard from '@rd/HoverCard';
import {
  HeartIcon,
  ArrowUpTrayIcon,
  ChatBubbleOvalLeftIcon,
  ArrowPathIcon,
  ChartBarSquareIcon,
} from '@heroicons/react/24/outline';
import Userinfo from '@components/UserInfo';
import MediaGrid from '@components/MediaGrid';
import useUserStore from '@store/useUserStore';
import axios from '@handler/fetch/axios';
import DropdownMenuMyDemo from './radix/DropdownMyMenu';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface Props {
  id: string;
  content: string;
  name: string;
  username: string;
  date: string;
  src: string;
  initials: string;
  followers: string;
  following: string;
  description: string;
  viewCount: string;
  mediaFiles?: string[];
  youtubeUrls?: string[];
  children?: React.ReactNode;
  commentsCount: number
  likesCount: number
  quoteCount: number
  onClick: () => void;

}

const Post: React.FC<Props> = ({
  id,
  content,
  name,
  username,
  date,
  children,
  src,  // 이제 UserDTO의 userImg를 사용할 수 있습니다.
  initials,
  followers,
  following,
  description,
  viewCount,
  mediaFiles,
  youtubeUrls,
  commentsCount,
  likesCount,
  quoteCount,
  onClick,
  ...props
}) =>{
  const [isLiked, setIsLiked] = useState(false);
  const userInfo = useUserStore(state=>state?.userInfo);

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지

    if (!userInfo?.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await axios.post(`/feeds/${id}/${userInfo.id}`);
      setIsLiked(response.data);
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  
  return(
  <div 
    className="flex flex-1 gap-x-4 mb-4 border-b border-gray-200 pb-4 px-4 cursor-pointer" 
    onClick={onClick}
  >
    <div className="flex-shrink-0">
      <HoverCard
        src={src}  // UserDTO의 userImg를 사용
        alt={name}
        initials={initials}
        name={name}
        username={username}
        following={following}
        followers={followers}
        description={description}
      />
    </div>
    <div className="flex flex-col flex-1">
      <div className="flex flex-1">
        <Userinfo
          name={name}
          username={username}
          date={date}
          tierName="novice"
        />
       <div className="">
  {userInfo?.userName === username ? (
    <DropdownMenuMyDemo feedId={id} />
  ) : (
    <DropdownMenuDemo />
  )}
</div>
      </div>
      <div className="text-sm text-slate-900 mb-4">{content}</div>
      {(mediaFiles && mediaFiles.length > 0) || (youtubeUrls && youtubeUrls.length > 0) ? (
        <div className="mb-4">
          <MediaGrid mediaFiles={mediaFiles || []} youtubeUrls={youtubeUrls || []} id={id} />
        </div>
      ) : null}
      {children}
      <div>
        <ul className="flex gap-x-10 xl:gap-x-14 text-xs text-slate-700 [&_li:first-child]:hidden [&_li:first-child]:lg:flex [&_li]:flex [&_li]:items-center [&_li]:gap-x-2 [&_li:xl]:gap-x-3">
          <li className="">
            <ChartBarSquareIcon className="w-5 h-5" />
            {viewCount}
          </li>
          <li>
            <ChatBubbleOvalLeftIcon className="w-5 h-5" />
            {commentsCount}
          </li>
          <li>
            <ArrowPathIcon className="w-5 h-5" />
            {quoteCount}
          </li>
          <li onClick={toggleLike}>
    {isLiked ? (
      <HeartIconSolid className="w-5 h-5 text-red-500" />
    ) : (
      <HeartIconOutline className="w-5 h-5" />
    )}
    {likesCount}
  </li>
          <li>
            <ArrowUpTrayIcon className="w-5 h-5" />
          </li>
        </ul>
      </div>
    </div>
  </div>
)};

export default Post;