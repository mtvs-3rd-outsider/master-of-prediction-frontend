"use client";
import { ReactNode } from 'react';
import DropdownMenuDemo from '@rd/DropdownMenu';
import HoverCard from '@rd/HoverCard';

import {
  HeartIcon,
  ArrowUpTrayIcon,
  ChatBubbleOvalLeftIcon,
  ArrowPathIcon,
  ChartBarSquareIcon,
} from '@heroicons/react/24/outline'; // Heroicons에서 아이콘 가져오기
import Userinfo from '@components/UserInfo';
interface Props {
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
  children?: ReactNode;
}

const Post = ({
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
  ...props
}: Props) => (
  <div className="flex flex-1 gap-x-4">
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
      {children}
      <div>
        <ul className="flex gap-x-10 xl:gap-x-14 text-xs text-slate-700 [&_li:first-child]:hidden [&_li:first-child]:lg:flex [&_li]:flex [&_li]:items-center [&_li]:gap-x-2 [&_li:xl]:gap-x-3 ">
          <li className="">
            <ChartBarSquareIcon className="w-5 h-5" />
            20
          </li>
          <li>
            <ChatBubbleOvalLeftIcon className="w-5 h-5" />2
          </li>
          <li>
            <ArrowPathIcon className="w-5 h-5" />1
          </li>
          <li>
            <HeartIcon className="w-5 h-5" />
            23
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
