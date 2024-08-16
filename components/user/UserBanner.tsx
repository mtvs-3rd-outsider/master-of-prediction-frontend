import React, { FC } from 'react';
import Image from 'next/image';

interface UserBannerProps {
  imageUrl: string;
  caption?: string;
  children?: React.ReactNode; 
}

const UserBanner: FC<UserBannerProps> = ({ imageUrl, children }) => {
  return (
    <div className="relative text-center h-28"> {/* h-28 for setting height, adjust as needed */}
      <Image
        src={imageUrl}
        alt="User Banner"
        layout="fill"
        objectFit="cover"
        className="rounded-3xl"
        priority
      />
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default UserBanner;
