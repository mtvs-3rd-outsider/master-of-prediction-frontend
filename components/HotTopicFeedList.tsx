import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';
import Post from '@ui/Post';
import { 
  getHotTopicFeeds, 
  getHomeTopicFeeds, 
  getLikeFeeds, 
  getFollowingFeeds 
} from '@handler/hotTopicApi';
import { FeedsResponseDTO } from '@components/types/feedsResponseDTO';

interface HotTopicFeedListProps {
  sortBy: 'views' | 'latest' | 'likes' | 'follow';
}

const HotTopicFeedList: React.FC<HotTopicFeedListProps> = ({ sortBy }) => {
  const [feeds, setFeeds] = useState<FeedsResponseDTO[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();
  const router = useRouter();

  const fetchFeeds = useCallback(async () => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    try {
      let response;
      
      switch (sortBy) {
        case 'views':
          response = await getHotTopicFeeds(page);
          break;
        case 'latest':
          response = await getHomeTopicFeeds(page);
          break;
        case 'likes':
          response = await getLikeFeeds(page);
          break;
        case 'follow':
          response = await getFollowingFeeds(page);
          break;
        default:
          response = await getHomeTopicFeeds(page);
      }

      const newFeeds = response.content;
      
      if (newFeeds.length === 0) {
        setHasMore(false);
      } else {
        setFeeds(prev => [...prev, ...newFeeds]);
        setPage(prev => prev + 1);
        setHasMore(!response.last);
      }
    } catch (error) {
      console.error('Error loading feeds:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, sortBy, hasMore, isLoading]);

  useEffect(() => {
    setFeeds([]);
    setPage(0);
    setHasMore(true);
  }, [sortBy]);

  useEffect(() => {
    if (inView && hasMore) {
      fetchFeeds();
    }
  }, [inView, hasMore, fetchFeeds]);

  const handlePostClick = useCallback((id: string) => {
    router.push(`/feed/${id}`);
  }, [router]);

  return (
    <div>
      {feeds.map((feed) => (
        <Post
          key={feed.id}
          id={feed.id.toString()}
          content={feed.content}
          name={feed.user?.displayName || feed.guest?.guestId || 'Unknown'}
          username={feed.user?.userName || feed.guest?.guestId || 'Unknown'}
          date={new Date(feed.createdAt).toLocaleString()}
          src={feed.user?.userImg || ''}
          initials={(feed.user?.userName?.[0] || feed.guest?.guestId?.[0] || 'U').toUpperCase()}
          description={''}
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
        />
      ))}
      <div ref={ref}>
        {isLoading ? 'Loading more...' : hasMore ? 'Load More' : ''}
      </div>
    </div>
  );
};

export default HotTopicFeedList;