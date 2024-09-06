"use client";
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  href: string;
  width: 'full' | 'inline' | 'mobile';
  size: 'default' | 'small' | 'large';
  children: ReactNode;
}

const NavItem = ({ href, children, width, size }: Props) => {
  // NextUI Button에서 width와 size를 기반으로 가변적 스타일 설정
  const buttonStyles = {
    width: width === 'full' ? '100%' : width === 'inline' ? 'auto' : 'fit-content',
    padding: size === 'small' ? '8px 12px' : size === 'large' ? '16px 24px' : '12px 16px',
	border: 'none', // 기본 경계선 없음
	borderRadius: '30px',
	color: '#000000',
    backgroundColor: 'transparent', // 배경색 없음
    '&:hover': {
      backgroundColor: '#e0e0e0', // 호버 시 배경색
    },
  };

  return (
    <Link href={href} passHref>
      <Button 
        as="a" 
        style={buttonStyles} 
        variant="ghost" // 배경이 없는 변형
        color="primary"
      >
        {children}
      </Button>
    </Link>
  );
};

export default NavItem;
