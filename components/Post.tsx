"use client";

import { ReactNode } from 'react';
import Image from 'next/image';
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
  images?: string[];
  videos?: string[];
  children?: ReactNode;
}

const Post = ({
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
  images,
  videos,
  ...props
}: Props) => (
  <div className="flex flex-1 gap-x-4 mb-4 border-b border-gray-200 pb-4">
    <div className="flex-shrink-0">
      <HoverCard
        src={src}
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
          <DropdownMenuDemo />
        </div>
      </div>
      <div className="text-sm text-slate-900 mb-4">{content}</div>
      {images && images.length > 0 && (
        <div className="mb-4 grid grid-cols-1 gap-2">
          {images.map((image, index) => (
            <div key={`${id}-image-${index}`} className="relative h-64 w-full">
              <Image
                src={image}
                alt={`Post image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
      {videos && videos.length > 0 && (
        <div className="mb-4 grid grid-cols-1 gap-2">
          {videos.map((video, index) => (
            <div key={`${id}-video-${index}`} className="relative h-64 w-full">
              <video
                src={video}
                controls
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
      {children}
      <div>
        <ul className="flex gap-x-10 xl:gap-x-14 text-xs text-slate-700 [&_li:first-child]:hidden [&_li:first-child]:lg:flex [&_li]:flex [&_li]:items-center [&_li]:gap-x-2 [&_li:xl]:gap-x-3">
          <li className="">
            <ChartBarSquareIcon className="w-5 h-5" />
            {viewCount}
          </li>
          <li>
            <ChatBubbleOvalLeftIcon className="w-5 h-5" />
            {following}
          </li>
          <li>
            <ArrowPathIcon className="w-5 h-5" />1
          </li>
          <li>
            <HeartIcon className="w-5 h-5" />
            {followers}
          </li>
          <li>
            <ArrowUpTrayIcon className="w-5 h-5" />
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default Post;