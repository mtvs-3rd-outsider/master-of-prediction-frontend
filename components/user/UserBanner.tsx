import React, { FC } from 'react';

interface UserBannerProps {
  imageUrl: string;
  caption?: string;
}

const UserBanner: FC<UserBannerProps> = ({ imageUrl, caption }) => {
  return (
    <div className="text-center mb-4">
      <img src={imageUrl} alt="User Banner" className="w-full max-h-64" />
    </div>
  );
};

export default UserBanner;
