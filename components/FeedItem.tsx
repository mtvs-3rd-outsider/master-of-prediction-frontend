
import React from 'react';
import Link from 'next/link';
import { HeartIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';

interface Feed {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: number;
}

interface FeedItemProps {
  feed: Feed;
}

const FeedItem: React.FC<FeedItemProps> = ({ feed }) => {
  return (
    <Link href={`/feed/${feed.id}`}>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-800">{feed.content}</p>
        <div className="mt-2 text-sm text-gray-500">
          <span>{feed.author}</span> • <span>{feed.createdAt}</span>
        </div>
        <div className="mt-2 flex space-x-4">
          <div className="flex items-center space-x-1">
            <HeartIcon className="h-5 w-5 text-gray-500" />
            <span>{feed.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ChatBubbleOvalLeftIcon className="h-5 w-5 text-gray-500" />
            <span>{feed.comments}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeedItem;