import React, { FC } from 'react';
import Image from 'next/image';

interface UserBannerProps {
  imageUrl: string;
  caption?: string;
}

const UserBanner: FC<UserBannerProps> = ({ imageUrl }) => {
  return (
    <div className="relative text-center mb-4 h-32"> {/* h-64 for setting height, adjust as needed */}
      <Image
        src={imageUrl}
        alt="User Banner"
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
      />
    </div>
  );
};

export default UserBanner;
