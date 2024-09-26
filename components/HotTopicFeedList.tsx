"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';
import Post from '@ui/Post';
import { getInitialHotTopicFeeds, getNextHotTopicFeeds } from '@handler/hotTopicApi';
import { HotTopicFeedResponseDTO } from '@components/types/feed';

const HotTopicFeedList: React.FC = () => {
  const [feeds, setFeeds] = useState<HotTopicFeedResponseDTO[]>([]);
  const [lastId, setLastId] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const router = useRouter();

  const loadMoreFeeds = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const newFeeds = lastId !== null
        ? await getNextHotTopicFeeds(lastId)
        : await getInitialHotTopicFeeds();

      if (newFeeds.length === 0) {
        setHasMore(false);
      } else {
        setFeeds((prevFeeds) => {
          const uniqueNewFeeds = newFeeds.filter(
            (newFeed) => !prevFeeds.some((prevFeed) => prevFeed.id === newFeed.id)
          );
          return [...prevFeeds, ...uniqueNewFeeds];
        });
        setLastId(newFeeds[newFeeds.length - 1].id);
      }
    } catch (error) {
      console.error('Error loading hot topic feeds:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [lastId, hasMore, loading]);

  useEffect(() => {
    loadMoreFeeds();
  }, []); // 초기 로딩을 위한 빈 의존성 배열

  useEffect(() => {
    if (inView && hasMore) {
      loadMoreFeeds();
    }
  }, [inView, hasMore, loadMoreFeeds]);

  const handlePostClick = useCallback((id: number) => {
    console.log("Clicked feed with id:", id);
    router.push(`/feed/${id}`);
  }, [router]);

  return (
    <div>
      {feeds.map((feed) => (
        <Post
          key={`feed-${feed.id}`}
          id={feed.id.toString()}
          content={feed.content}
          name={feed.user?.displayName || feed.guest?.guestId || 'Unknown'}
          username={feed.user?.userName || feed.guest?.guestId || 'Unknown'}
          date={new Date(feed.createdAt).toLocaleString()}
          src={feed.user?.userImg || ''}
          initials={(feed.user?.userName?.[0] || feed.guest?.guestId?.[0] || 'U').toUpperCase()}
          description={feed.title}
          followers={""}
          following={""}
          viewCount={feed.viewCount.toString()}
          commentsCount={feed.commentsCount}
          likesCount={feed.likesCount}
          quoteCount={feed.quoteCount}
          mediaFiles={feed.mediaFileUrls}
          youtubeUrls={feed.youtubeUrls}
          onClick={() => handlePostClick(feed.id)}
          isLikedByUser={false}
        />
      ))}
      <div ref={ref}>
        {loading && 'Loading more...'}
        {!loading && !hasMore && 'No more feeds'}
      </div>
    </div>
  );
};

export default HotTopicFeedList;