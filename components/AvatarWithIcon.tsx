import React from 'react';
import Image from 'next/image';
type AvatarProps = {
  src?: string; // src is optional
  alt: string;
  initials: string;
  size?: number; // size now directly accepts a numeric value
  children?: React.ReactNode; // Add children prop to accept additional content (icon)
};

const Avatar = ({
  src,
  alt,
  initials,
  size = 48, // default size is set to 48 pixels
  children,
}: AvatarProps) => {
  // src가 없을 경우 initials를 표시할지 여부 결정
  const showInitials = !src;

  return (
    <div
      className="relative flex items-center justify-center bg-gradient-to-br from-[#5C4747] to-[#000000] rounded-full overflow-hidden"
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={size}  // width를 size로 지정
          height={size} 
          className="object-cover w-full h-full"
        />
      ) : (
        <span className="text-white text-lg font-bold">
          {initials}
        </span>
      )}
      {/* 아이콘을 무조건 표시 */}
      {children && (
        <div className="absolute ">
          {children}
        </div>
      )}
    </div>
  );
};

export default Avatar;
