import React, { FC } from 'react';
import Image from 'next/image';

type UserBannerProps = {
  imageUrl?: string;
  children?: React.ReactNode;
};

const UserBanner: FC<UserBannerProps> = ({ imageUrl, children }) => {
  const defaultImageUrl = "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2532&q=80";

  return (
    <div className="relative text-center h-28"> {/* h-28 for setting height, adjust as needed */}
      <Image
        src={imageUrl || defaultImageUrl}  // Use defaultImageUrl if imageUrl is null or undefined
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
