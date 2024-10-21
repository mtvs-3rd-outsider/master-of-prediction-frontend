"use client";
import React, { useState, useEffect } from 'react';
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

export interface PostItem {
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
  commentsCount: number;
  likesCount: number;
  quoteCount: number;
  onClick: () => void;
  isLike: boolean; // 새로운 prop: 사용자가 이미 좋아요를 눌렀는지 여부
  userId?:number;
}

const Post: React.FC<PostItem> = ({
  id,
  content,
  name,
  username,
  date,
  children,
  src,
  initials,
  followers,
  following,
  description,
  viewCount,
  mediaFiles,
  youtubeUrls,
  commentsCount = 0,
  likesCount: initialLikesCount = 0,
  quoteCount = 0,
  onClick = () => {},
  isLike = false,
  userId,
  ...props
}) => {
  const [isLiked, setIsLiked] = useState(isLike);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const userInfo = useUserStore(state => state?.userInfo);

  useEffect(() => {
    setIsLiked(isLike);
    setLikesCount(initialLikesCount);
  }, [isLike, initialLikesCount]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!userInfo?.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const likeDTO = {
        likeType: 'FEED',
        viewType: 'HOTTOPICCHANNEL',
        userId: userInfo.id,
        targetId: id
      };

      const response = await axios.post('/like', likeDTO, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.message === "좋아요") {
        setIsLiked(true);
        setLikesCount(prevCount => prevCount + 1);
      } else if (response.data.message === "좋아요 취소") {
        setIsLiked(false);
        setLikesCount(prevCount => prevCount - 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };


  return (
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
  {userInfo?.id === userId? (
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