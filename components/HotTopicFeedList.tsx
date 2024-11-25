import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import Post from "@ui/Post";
import {
  getHotTopicFeeds,
  getHomeTopicFeeds,
  getLikeFeeds,
  getFollowingFeeds,
} from "@handler/hotTopicApi";
import { FeedsResponseDTO } from "@components/types/feedsResponseDTO";

interface HotTopicFeedListProps {
  sortBy: "views" | "latest" | "likes" | "follow";
}

const HotTopicFeedList: React.FC<HotTopicFeedListProps> = ({ sortBy }) => {
  const [feeds, setFeeds] = useState<FeedsResponseDTO[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();
  const router = useRouter();

  const getFeedsBySort = useCallback(
    async (pageNum: number) => {
      switch (sortBy) {
        case "views":
          return await getHotTopicFeeds(pageNum);
        case "latest":
          return await getHomeTopicFeeds(pageNum);
        case "likes":
          return await getLikeFeeds(pageNum);
        case "follow":
          return await getFollowingFeeds(pageNum);
        default:
          return await getHomeTopicFeeds(pageNum);
      }
    },
    [sortBy]
  );

  const loadMoreFeeds = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const response = await getFeedsBySort(page);
      const newFeeds = response.content;
      console.log(newFeeds);
      if (newFeeds.length === 0) {
        setHasMore(false);
      } else {
        setFeeds((prevFeeds) => [...prevFeeds, ...newFeeds]);
        setPage((prevPage) => prevPage + 1);
        setHasMore(!response.last);
      }
    } catch (error) {
      console.error("Error loading feeds:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, getFeedsBySort, isLoading]);

  // sortBy가 변경될 때 상태 초기화
  useEffect(() => {
    setFeeds([]);
    setPage(0);
    setHasMore(true);
    setIsLoading(false);
  }, [sortBy]);

  // 페이지가 0이거나 inView일 때 피드 로드
  useEffect(() => {
    if ((page === 0 || inView) && hasMore && !isLoading) {
      loadMoreFeeds();
    }
  }, [inView, hasMore, loadMoreFeeds, page, isLoading]);

  const handlePostClick = useCallback(
    (id: string) => {
      router.push(`/feed/${id}`);
    },
    [router]
  );

  return (
    <div className="pb-[70px] lg:pb-0" >
      {feeds.length > 0 ? (
        feeds.map((feed) => (
          <div key={`feed-container-${feed.id}`}>
            <Post
              key={`feed-${feed.id}`}
              id={feed.id.toString()}
              content={feed.content}
              name={feed.user?.displayName || feed.guest?.guestId || "Unknown"}
              username={feed.user?.userName || feed.authorType || "Unknown"}
              date={new Date(feed.createdAt).toLocaleString()}
              src={feed.user?.userImg || ""}
              initials={(
                feed.user?.userName?.[0] ||
                feed.guest?.guestId?.[0] ||
                "U"
              )}
              description={""}
              followers={feed.likesCount.toString()}
              following={feed.commentsCount.toString()}
              viewCount={feed.viewCount.toString()}
              mediaFiles={feed.mediaFileUrls}
              youtubeUrls={feed.youtubeUrls}
              commentsCount={feed.commentsCount}
              likesCount={feed.likesCount}
              shareCount={feed.shareCount}
              onClick={() => handlePostClick(feed.id.toString())}
              isLike={feed.isLike || false}
              userId={feed.user?.userId}
              isShare={feed.isShare || false}
              quoteFeed={feed.quoteFeed}
              isQuote={feed.isQuote}
              guest={feed.guest}
            />
          </div>
        ))
      ) : (
        <div className="flex flex-col justify-center h-screen font-GangwonEduPowerExtraBoldA">
          <p className="text-center text-2xl">게시글이 없습니다.</p>
          <p className="text-center text-4xl">첫 게시글을 작성해보세요!</p>
        </div>
      )}
      <div ref={ref}>{isLoading ? "Loading more..." : ""}</div>
    </div>
  );
};

export default HotTopicFeedList;