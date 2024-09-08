"use client";
import { useRouter } from 'next/navigation';
import { FC } from "react";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import IconButtonDefault from '@components/IconButton';

interface BackButtonContainerProps {
  href?: string;  // href를 선택적으로 받도록 설정
}

const BackButtonContainer: FC<BackButtonContainerProps> = ({ href }) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (href) {
      router.push(href);  // href가 제공되면 해당 경로로 이동
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();  // 브라우저 히스토리가 있으면 이전 페이지로 이동
    } else {
      router.push('/');  // 기본 경로로 이동 (홈 페이지나 원하는 기본 페이지로 설정)
    }
  };

  return (
    <IconButtonDefault icon={faArrowLeft} onClick={handleBackClick} ariaLabel="Go back" />
  );
};

export default BackButtonContainer;
