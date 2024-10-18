import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';
import Post from '@ui/Post';
import { getChannelFeeds } from '@handler/channelApi';
import { FeedsResponseDTO } from '@components/types/feedsResponseDTO';

interface ChannelFeedListProps {
  channelType: string;
  channelId: number;
}

const ChannelFeedList: React.FC<ChannelFeedListProps> = ({ channelType, channelId }) => {
  const [feeds, setFeeds] = useState<FeedsResponseDTO[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const router = useRouter();

  const loadMoreFeeds = useCallback(async () => {
    if (!hasMore) return;

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
      console.error('Error loading channel feeds:', error);
    }
  }, [page, hasMore, channelType, channelId]);

  useEffect(() => {
    if (inView) {
      loadMoreFeeds();
    }
  }, [inView, loadMoreFeeds]);

  const handlePostClick = useCallback((id: string) => {
    router.push(`/feed/${id}`);
  }, [router]);


  return (
    <div>
      {feeds.map((feed) => (
        <div key={`feed-container-${feed.id}`}>
          <Post
            key={`feed-${feed.id}`}
            id={feed.id.toString()}
            content={feed.content}
            name={feed.user?.userName || feed.guest?.guestId || 'Unknown'}
            username={feed.user?.userName || feed.guest?.guestId || 'Unknown'}
            date={new Date(feed.createdAt).toLocaleString()}
            src={feed.user?.userImg || ''}
            initials={(feed.user?.userName?.[0] || feed.guest?.guestId?.[0] || 'U').toUpperCase()}
            description={feed.title}
            followers={feed.likesCount.toString()}
            following={feed.commentsCount.toString()}
            viewCount={feed.viewCount.toString()}
            mediaFiles={feed.mediaFileUrls}
            youtubeUrls={feed.youtubeUrls}
            commentsCount={feed.commentsCount}
            likesCount={feed.likesCount}
            quoteCount={feed.quoteCount || 0}
            onClick={() => handlePostClick(feed.id.toString())}
            isLike={feed.isLike || false} 
          />
        </div>
      ))}
      <div ref={ref}>
        {hasMore ? 'Loading more...' : 'No more feeds'}
      </div>
    </div>
  );
};

export default ChannelFeedList;