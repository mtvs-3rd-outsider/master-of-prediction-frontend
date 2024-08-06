"use client";
import React from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import UserBanner from '@components/user/UserBanner';
import IconButton from '@components/IconButton';
import Avatar from '@components/radix/Avatar';
import { useScrollStore } from '@store/useScrollStore';

const StickyHeader: React.FC = () => {
  const scrollY = useScrollStore((state) => state.scrollY);

  const minHeight = 40; // Minimum height of the banner
  const maxHeight = 150; // Maximum height of the banner
  const bannerHeight = Math.max(minHeight, maxHeight - Math.min(scrollY, maxHeight - minHeight));

  const avatarMaxSize = 100; // Maximum size of the avatar
  const avatarMinSize = 50;  // Minimum size of the avatar before it starts moving up
  const avatarSize = Math.max(avatarMinSize, avatarMaxSize - (scrollY * (avatarMaxSize / (maxHeight - minHeight))));

  // Calculate the initial and final top position for the avatar based on scrollY
  const avatarInitialTop = maxHeight - avatarMaxSize / 2;
  const avatarFinalTop = bannerHeight - avatarMinSize / 2;

  // Adjust the speed of the avatar moving up
  const avatarScrollSpeedFactor = 0.5; // Reduce the speed by half
  const adjustedScrollY = scrollY * avatarScrollSpeedFactor;
  const avatarTop = avatarInitialTop - (adjustedScrollY * (avatarInitialTop - avatarFinalTop) / (maxHeight - minHeight));

  // Determine the z-index based on scroll position
  const avatarZIndex = scrollY > (maxHeight - minHeight) ? -1 : 10;

  return (
    <div className="sticky top-0 z-10">
      <div className="absolute top-0 left-0 z-10">
        <IconButton icon={faArrowLeft} />
      </div>
      <div className="relative overflow-hidden" style={{ height: `${bannerHeight}px`, transition: 'height 0.3s' }}>
        <UserBanner
          imageUrl="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2532&q=80"
        />
      </div>
      <div
        className="absolute left-0 ml-4 transition-all"
        style={{
          top: `${avatarTop}px`,
          width: `${avatarSize}px`,
          height: `${avatarSize}px`,
          zIndex: avatarZIndex,
          transition: 'top 0.3s ease, width 0.3s ease, height 0.3s ease, z-index 0s',
        }}
      >
        <Avatar
          src="https://your-avatar-url.com/avatar.jpg"
          alt="User Avatar"
          initials="UA"
          size={avatarSize} // Pass the calculated size directly
        />
      </div>
    </div>
  );
};

export default StickyHeader;
