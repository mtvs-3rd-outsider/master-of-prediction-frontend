import React, { useState } from 'react';
import Image from 'next/image';

interface TierIconProps {
  name?: string;
  size?: number;
  className?: string;
}

const TierIcon: React.FC<TierIconProps> = ({ name , size = 24, className }) => {
  const [isError, setIsError] = useState(false); // 에러 상태 관리

  // 이미지 로드 실패 시 호출되는 함수
  const handleError = () => {
    setIsError(true); // 에러 상태를 true로 설정
  };

  if (isError || name==undefined) {
    // 에러 상태일 경우 null을 반환하여 아무것도 렌더링하지 않음
    return null;
  }

  return (
    <Image
      src={`/images/tier/${name}.webp`}
      alt={`${name} icon`}
      width={size}
      height={size}
      className={className}
    />
  );
};

export default TierIcon;
