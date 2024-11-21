import React, { useEffect, useState } from "react";
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import ReuploadMenu from "./ReuploadMenu";
import useUserStore from "@store/useUserStore";
import { faL } from "@fortawesome/free-solid-svg-icons";
import axios from "@handler/fetch/axios";
import { useRouter } from "next/navigation";

interface PostStatsNavProps {
  viewCount: string;
  commentsCount: number;
  shareCount: number;
  feedId: string;
  isShare: boolean;
  isLike: boolean;
  likesCount: number;
  // toggleLike: (e: React.MouseEvent) => void;
  // toggleReupload: (e: React.MouseEvent) => void;
  // handleQuote: (e: React.MouseEvent) => void;
}

const PostStatsNav: React.FC<PostStatsNavProps> = ({
  viewCount,
  commentsCount,
  feedId,
  shareCount,
  isShare,
  isLike = false,
  likesCount: initialLikesCount = 0,
}) => {
  const userInfo = useUserStore((state) => state?.userInfo);
  const [isLiked, setIsLiked] = useState(isLike);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isShared, setIsShared] = useState(isShare);
  const [currentShareCount, setCurrentShareCount] = useState(shareCount);
  const router = useRouter();

  useEffect(() => {
    setIsLiked(isLike);
    setLikesCount(initialLikesCount);
    setIsShared(isShare);
    setCurrentShareCount(shareCount);
  }, [isLike, initialLikesCount, isShare, shareCount]);

  const toggleReupload = async (e: React.MouseEvent) => {
    console.log("toggleReupload 실행됨");
    e.preventDefault(); // 기본 동작(링크 이동) 방지

    e.stopPropagation();

    if (!userInfo?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      if (!isShared) {
        setIsShared(true);
        setCurrentShareCount((prev) => prev + 1);
        const response = await axios.post(`feeds/${feedId}/reupload`);
        if (response.status !== 200) {
          setIsShared(false);
          setCurrentShareCount((prev) => prev - 1);
        }
      } else {
        setIsShared(false);
        setCurrentShareCount((prev) => prev - 1);
        const response = await axios.delete(`feeds/${feedId}/reupload`);
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
    e.preventDefault(); // 기본 동작(링크 이동) 방지
    e.stopPropagation();

    if (!userInfo?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    router.push(`/hot-topic/create-feed?quoteId=${feedId}`);
  };

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // 기본 동작(링크 이동) 방지

    if (!userInfo?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const likeDTO = {
        likeType: "FEED",
        viewType: "HOTTOPICCHANNEL",
        userId: userInfo.id,
        targetId: feedId,
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
    <>
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
          feedId={feedId}
          isShare={isShare}
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
    </>
  );
};

export default PostStatsNav;
