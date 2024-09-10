// components/FeedList.tsx
import React from 'react';
import Post from '@ui/Post';

interface Feed {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    initials: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  followers: string;
  following: string;
  description: string;
}

interface FeedListProps {
  feeds: Feed[];
}

const FeedList: React.FC<FeedListProps> = ({ feeds }) => {
  return (
    <ul className="divide-y divide-gray-200">
      {feeds.map((feed) => (
        <li key={feed.id} className="py-4">
          <Post
            content={feed.content}
            name={feed.author.name}
            username={feed.author.username}
            date={feed.createdAt}
            src={feed.author.avatar}
            initials={feed.author.initials}
            followers={feed.followers}
            following={feed.following}
            description={feed.description}
          />
        </li>
      ))}
    </ul>
  );
};

export default FeedList;