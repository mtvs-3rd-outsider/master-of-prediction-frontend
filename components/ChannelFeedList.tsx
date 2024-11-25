import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import Post from "@ui/Post";
import { getChannelFeeds } from "@handler/channelApi";
import { FeedsResponseDTO } from "@components/types/feedsResponseDTO";

interface ChannelFeedListProps {
  channelType: string;
  channelId: number;
}

const ChannelFeedList: React.FC<ChannelFeedListProps> = ({
  channelType,
  channelId,
}) => {
  const [feeds, setFeeds] = useState<FeedsResponseDTO[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();
  const router = useRouter();

  const loadMoreFeeds = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const response = await getChannelFeeds(channelType, channelId, page);
      const newFeeds = response.content;

      if (newFeeds.length === 0) {
        setHasMore(false);
      } else {
        setFeeds((prevFeeds) => [...prevFeeds, ...newFeeds]);
        setPage((prevPage) => prevPage + 1);
        setHasMore(!response.last);
      }
    } catch (error) {
      console.error("Error loading channel feeds:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading, channelType, channelId]);

  useEffect(() => {
    setFeeds([]);
    setPage(0);
    setHasMore(true);
    loadMoreFeeds();
  }, [channelType, channelId]);

  useEffect(() => {
    if (inView && hasMore) {
      loadMoreFeeds();
    }
  }, [inView, hasMore, loadMoreFeeds]);

  const handlePostClick = useCallback(
    (id: string) => {
      router.push(`/feed/${id}`);
    },
    [router]
  );

  return (
    <div>
      {feeds.length > 0
        ? feeds.map((feed) => (
            <div key={`feed-container-${feed.id}`}>
              <Post
                key={`feed-${feed.id}`}
                id={feed.id.toString()}
                content={feed.content}
                name={
                  feed.user?.displayName || feed.guest?.guestId || "Unknown"
                }
                username={
                  feed.user?.userName || feed.guest?.guestId || "Unknown"
                }
                date={new Date(feed.createdAt).toLocaleString()}
                src={feed.user?.userImg || ""}
                initials={(
                  feed.user?.userName?.[0] ||
                  feed.guest?.guestId?.[0] ||
                  "U"
                ).toUpperCase()}
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
                channel={feed.channel}
              />
            </div>
          ))
        : !isLoading && (
            <div className="flex flex-col justify-center h-screen font-GangwonEduPowerExtraBoldA">
              <p className="text-center text-2xl">
                게시글을 작성하지 않았습니다.
              </p>
              <p className="text-center text-4xl">게시글을 작성해보세요!</p>
            </div>
          )}
      <div ref={ref}>{hasMore && isLoading && "Loading more..."}</div>
    </div>
  );
};

export default ChannelFeedList;
