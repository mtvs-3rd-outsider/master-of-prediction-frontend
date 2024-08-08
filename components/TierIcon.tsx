import React from 'react';
import Image from 'next/image';
interface TierIconProps {
  name: string;
  size?: number;
}

const TierIcon: React.FC<TierIconProps> = ({ name, size = 24 }) => {
  const src = `/images/tier/${name}.svg`; // 상대 경로 사용
  return (
    <Image
      src={src} // 동적 임포트
      alt={`${name} icon`}
      width={size}
      height={size}
    />
  );
};

export default TierIcon;
