// components/FeedDetailContainer.tsx
'use client';

import React, { useEffect, useState } from 'react';
import FeedDetail from './FeedDetail';
import { getFeedById } from '@handler/feedApi';
import { FeedResponseDTO } from '@components/types/feedResponseDTO';

interface FeedDetailContainerProps {
  feedId: string;
}

const FeedDetailContainer: React.FC<FeedDetailContainerProps> = ({ feedId }) => {
  const [feed, setFeed] = useState<FeedResponseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const loadFeed = async () => {
      try {
        const data = await getFeedById(Number(feedId));
        setFeed(data);
      } catch (err) {
        console.error("Error fetching feed:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    loadFeed();
  }, [feedId]);

  if (error) return <div>Error loading feed: {error}</div>;
  if (!feed) return <div>Loading...</div>;

  return <FeedDetail feed={feed} />;
};

export default FeedDetailContainer;