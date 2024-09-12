"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import Post from '@ui/Post';
import { getInitialHotTopicFeeds, getNextHotTopicFeeds } from '@handler/hotTopicApi';
import { HotTopicFeedResponseDTO } from '@components/types/feed';

const HotTopicFeedList: React.FC = () => {
  const [feeds, setFeeds] = useState<HotTopicFeedResponseDTO[]>([]);
  const [lastId, setLastId] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const loadMoreFeeds = useCallback(async () => {
    if (!hasMore) return;

    try {
      const newFeeds = lastId
        ? await getNextHotTopicFeeds(lastId)
        : await getInitialHotTopicFeeds();

      if (newFeeds.length === 0) {
        setHasMore(false);
      } else {
        setFeeds((prevFeeds) => {
          // 중복 제거
          const uniqueNewFeeds = newFeeds.filter(
            (newFeed) => !prevFeeds.some((prevFeed) => prevFeed.id === newFeed.id)
          );
          return [...prevFeeds, ...uniqueNewFeeds];
        });
        setLastId(newFeeds[newFeeds.length - 1].id);
      }
    } catch (error) {
      console.error('Error loading hot topic feeds:', error);
    }
  }, [lastId, hasMore]);

  useEffect(() => {
    if (inView) {
      loadMoreFeeds();
    }
  }, [inView, loadMoreFeeds]);

  return (
    <div>
      {feeds.map((feed) => (
        <Post
          key={`feed-${feed.id}`}
          id={feed.id.toString()}
          content={feed.content}
          name={feed.user?.userName || feed.guest?.guestId || 'Unknown'}
          username={feed.user?.userName || feed.guest?.guestId || 'Unknown'}
          date={new Date(feed.createdAt).toLocaleString()}
          src={feed.user?.userImg || ''}
          initials={feed.user?.userName?.[0] || feed.guest?.guestId?.[0] || 'U'}
          description={feed.title}
          followers={feed.likesCount.toString()}
          following={feed.commentsCount.toString()}
          viewCount={feed.viewCount.toString()}
          images={feed.imageFiles?.map(file => file.imageUrl) || []}
          videos={feed.youTubeVideos?.map(video => video.youtubeUrl) || []}
        />
      ))}
      <div ref={ref}>
        {hasMore ? 'Loading more...' : 'No more feeds'}
      </div>
    </div>
  );
};

export default HotTopicFeedList;