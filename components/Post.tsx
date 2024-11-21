"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DropdownMenuDemo from "@rd/DropdownMenu";
import HoverCard from "@rd/HoverCard";
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import Userinfo from "@components/UserInfo";
import MediaGrid from "@components/MediaGrid";
import useUserStore from "@store/useUserStore";
import axios from "@handler/fetch/axios";
import DropdownMenuMyDemo from "./radix/DropdownMyMenu";
import ReuploadMenu from "./ReuploadMenu";
import QuotePost from "./QuotePost";
import { UserDTO, GuestDTO } from "@components/types/feedResponseDTO";

export interface PostItem {
  id: string;
  content: string;
  name: string;
  username: string;
  date: string;
  src: string;
  initials: string;
  followers: string;
  following: string;
  description: string;
  viewCount: string;
  mediaFiles?: string[];
  youtubeUrls?: string[];
  children?: React.ReactNode;
  commentsCount: number;
  likesCount: number;
  shareCount: number;
  onClick: () => void;
  isLike: boolean;
  userId?: number;
  isShare: boolean;
  quoteFeed?: {
    quoteId: number;
    quoteContent: string;
    quoteCreateAt: string;
    quoteUser: UserDTO | null;
    quoteGuest: GuestDTO | null;
    mediaFileUrls: string[];
    youtubeUrls: string[];
  };
  isQuote?: boolean;
}

const Post: React.FC<PostItem> = ({
  id,
  content,
  name,
  username,
  date,
  children,
  src,
  initials,
  followers,
  following,
  description,
  viewCount,
  mediaFiles,
  youtubeUrls,
  commentsCount = 0,
  likesCount: initialLikesCount = 0,
  shareCount = 0,
  onClick = () => {},
  isLike = false,
  isShare = false,
  userId,
  quoteFeed,
  isQuote = false,
}) => {
  const [isLiked, setIsLiked] = useState(isLike);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isShared, setIsShared] = useState(isShare);
  const [currentShareCount, setCurrentShareCount] = useState(shareCount);
  const userInfo = useUserStore((state) => state?.userInfo);
  const router = useRouter();

  useEffect(() => {
    setIsLiked(isLike);
    setLikesCount(initialLikesCount);
    setIsShared(isShare);
    setCurrentShareCount(shareCount);
  }, [isLike, initialLikesCount, isShare, shareCount]);

  const toggleReupload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userInfo?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      if (!isShared) {
        setIsShared(true);
        setCurrentShareCount((prev) => prev + 1);
        const response = await axios.post(`feeds/${id}/reupload`);
        if (response.status !== 200) {
          setIsShared(false);
          setCurrentShareCount((prev) => prev - 1);
        }
      } else {
        setIsShared(false);
        setCurrentShareCount((prev) => prev - 1);
        const response = await axios.delete(`feeds/${id}/reupload`);
        if (response.status !== 200) {
          setIsShared(true);
          setCurrentShareCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      setIsShared(!isShared);
      setCurrentShareCount((prev) => (isShared ? prev + 1 : prev - 1));
      console.error("Error toggling reupload:", error);
      alert("재업로드 처리 중 오류가 발생했습니다.");
    }
  };
  const handleQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userInfo?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    router.push(`/hot-topic/create-feed?quoteId=${id}`);
  };

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userInfo?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const likeDTO = {
        likeType: "FEED",
        viewType: "HOTTOPICCHANNEL",
        userId: userInfo.id,
        targetId: id,
      };

      const response = await axios.post("/like", likeDTO);

      if (response.data.message === "좋아요") {
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      } else if (response.data.message === "좋아요 취소") {
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      className="flex flex-1 gap-x-4 mb-4 border-b border-gray-200 pb-4 px-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        <HoverCard
          src={src}
          alt={name}
          initials={initials}
          name={name}
          username={username}
          following={following}
          followers={followers}
          description={description}
        />
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex flex-1">
          <Userinfo
            name={name}
            username={username}
            date={date}
            tierName="novice"
          />
          <div>
            {userInfo?.id === userId ? (
              <DropdownMenuMyDemo feedId={id} />
            ) : (
              <DropdownMenuDemo />
            )}
          </div>
        </div>

        <div className="text-sm text-slate-900 mb-4">{content}</div>

        {((mediaFiles && mediaFiles.length > 0) ||
          (youtubeUrls && youtubeUrls.length > 0)) && (
          <div className="mb-4">
            <MediaGrid
              mediaFiles={mediaFiles || []}
              youtubeUrls={youtubeUrls || []}
              id={id}
            />
          </div>
        )}

        {isQuote && quoteFeed && (
          <QuotePost
            quoteId={quoteFeed.quoteId}
            quoteContent={quoteFeed.quoteContent}
            quoteCreateAt={quoteFeed.quoteCreateAt}
            quoteUser={quoteFeed.quoteUser}
            quoteGuest={quoteFeed.quoteGuest}
            mediaFileUrls={quoteFeed.mediaFileUrls}
            youtubeUrls={quoteFeed.youtubeUrls}
            onClick={() => router.push(`/feed/${quoteFeed.quoteId}`)}
          />
        )}

        {children}

        <div>
          <ul className="flex justify-between gap-x-10 xl:gap-x-14 text-xs text-slate-700 [&_li:first-child]:hidden [&_li:first-child]:lg:flex [&_li]:flex [&_li]:items-center [&_li]:gap-x-2 [&_li:xl]:gap-x-3">
            <li>
              <ChartBarSquareIcon className="w-5 h-5" />
              {viewCount}
            </li>
            <li>
              <ChatBubbleOvalLeftIcon className="w-5 h-5" />
              {commentsCount}
            </li>
            <li>
              <ReuploadMenu
                feedId={id}
                isShare={isShared}
                shareCount={currentShareCount}
                onToggleReupload={toggleReupload}
                onQuote={handleQuote}
              />
            </li>
            <li onClick={toggleLike}>
              {isLiked ? (
                <HeartIconSolid className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
              {likesCount}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Post;
