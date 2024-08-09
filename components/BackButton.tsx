"use client";
import { useRouter } from 'next/navigation';
import { FC } from "react";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import IconButtonDefault from '@components/IconButton';

const BackButtonContainer: FC = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
      <IconButtonDefault icon={faArrowLeft} onClick={handleBackClick}   ariaLabel="Go back" />
  );
};

export default BackButtonContainer;
