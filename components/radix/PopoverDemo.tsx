'use client';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover';
import NavItem from '@ui/NavItem';
import Accordion from '@rd/Accordion';
import { ReactNode } from 'react';

import {
  EllipsisHorizontalCircleIcon,
  ChatBubbleBottomCenterTextIcon,
  ListBulletIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'; // Heroicons에서 아이콘 가져오기

interface NavLinkItem {
  href: string;
  text: string;
  icon?: ReactNode;
}

const items: NavLinkItem[] = [
  {
    href: '/topics',
    text: 'Topics',
    icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />,
  },
  {
    href: '/lists',
    text: 'Lists',
    icon: <ListBulletIcon className="w-6 h-6" />,
  },
  {
    href: '/twitter-circle',
    text: 'Twitter Circle',
    icon: <UserGroupIcon className="w-6 h-6" />,
  },
];

const PopoverDemo = () => (
  <Popover>
    <PopoverTrigger>
      <button
        className="flex flex-row max-w-fit px-4 py-3 hover:bg-slate-100 focus:outline-none items-center gap-x-4 text-slate-900 my-1 rounded-full"
        aria-label="More options"
      >
        <EllipsisHorizontalCircleIcon className="w-6 h-6" /> {/* Heroicons 아이콘 사용 */}
        <div className="hidden xl:inline-flex flex-none text-lg font-medium">
          More
        </div>
      </button>
    </PopoverTrigger>
    <PopoverContent>
      <div className="PopoverContent overflow-hidden w-80 rounded-xl shadow-xl border border-slate-200 bg-white">
        <div className="flex flex-col">
          {items.map(({ href, text, icon }, i) => (
            <NavItem
              key={`header-${i}`}
              href={href}
              width="full"
              size="default"
            >
              {icon}
              <div className="inline-flex flex-none text-lg font-medium">
                {text}
              </div>
            </NavItem>
          ))}
        </div>

        <Accordion />
      </div>
    </PopoverContent>
  </Popover>
);

export default PopoverDemo;
