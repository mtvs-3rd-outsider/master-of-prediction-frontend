"use client";
import { ReactNode } from 'react';
import NavItem from '@ui/NavItem';
import AccountNavItem from '@ui/AccountNavItem';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  HashtagIcon,
  BellIcon,
  EnvelopeIcon,
  BookmarkIcon,
  UserIcon,
} from '@heroicons/react/24/outline'; // Heroicons에서 아이콘 가져오기
import {Button} from '@nextui-org/button';
import Link from 'next/link';

interface NavLinkItem {
  href: string;
  text: string;
  icon?: ReactNode;
}

const items: NavLinkItem[] = [
  {
    href: '/bettings',
    text: 'Bettings',
    icon: <HomeIcon className="w-6 h-6" />, // Heroicons 아이콘으로 대체
  },
  {
    href: '/explore',
    text: 'Hot Topic',
    icon: <HashtagIcon className="w-6 h-6" />, // Heroicons 아이콘으로 대체
  },
  {
    href: '/notifications',
    text: 'Notifications',
    icon: <BellIcon className="w-6 h-6" />, // Heroicons 아이콘으로 대체
  },
  {
    href: '/messages',
    text: 'Messages',
    icon: <EnvelopeIcon className="w-6 h-6" />, // Heroicons 아이콘으로 대체
  },
  {
    href: '/bookmarks',
    text: 'Category Channel',
    icon: <BookmarkIcon className="w-6 h-6" />, // Heroicons 아이콘으로 대체
  },
  {
    href: '/channel/1',
    text: 'My Channel',
    icon: <UserIcon className="w-6 h-6" />, // Heroicons 아이콘으로 대체
  },
];

const Nav: React.FC = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push('/login');
  };
  return (
    <>
      <header className="hidden sm:flex w-24 xl:col-span-2">
        <div className="flex flex-1 xl:w-60 flex-col fixed h-full">
          <div className="flex flex-col flex-1">
            <NavItem href="/" width="inline" size="default">
            <Image 
                src="/images/logo.png" 
                alt="Logo" 
                width={24} 
                height={24} 
                className="w-6 h-6" 
              />  {/* next/image 컴포넌트를 사용하여 트위터 로고 렌더링 */}
            </NavItem>
            {items.map(({ href, text, icon }, i) => (
              <div key={`header-${i}`} className="rounded-lg focus:outline-none overflow-hidden">
                <NavItem href={href} width="inline" size="default">
                  {icon}
                  <div className="hidden xl:inline-flex flex-none text-lg font-medium">
                    {text}
                  </div>
                </NavItem>
              </div>
            ))}
          </div>
          <div>
          <Button
      radius="full"
      variant="solid"
      color="primary"
      className="font-bold w-full p-3"
      onClick={handleClick}
    >
      로그인
    </Button>
            <AccountNavItem />
          </div>
        </div>
      </header>

      <footer className="sm:hidden z-10 fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around">
        {items.map(({ href, icon }, i) => (
          <NavItem key={`footer-${i}`} href={href} width="inline" size="default">
            {icon}
          </NavItem>
        ))}
      </footer>
    </>
  );
};

export default Nav;
