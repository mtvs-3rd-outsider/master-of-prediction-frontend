// app/hot-topic/page.tsx
import React from 'react';
import FeedList from '@/components/FeedList';
import CreateFeedButton from '@/components/CreateFeedButton';
import Header from '@ui/Header';

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

async function getFeeds(): Promise<Feed[]> {
  // TODO: 실제 API에서 데이터를 가져오는 로직으로 대체해야 합니다.
  // 여기서는 임시로 더미 데이터를 반환합니다.
  return [
    {
      id: '1',
      content: '첫 번째 피드입니다.',
      author: {
        name: '사용자1',
        username: 'user1',
        avatar: 'https://example.com/avatar1.jpg',
        initials: 'U1'
      },
      createdAt: '2023-09-09',
      likes: 10,
      comments: 5,
      followers: '1.5K',
      following: '500',
      description: '열정적인 개발자'
    },
    {
      id: '2',
      content: '두 번째 피드입니다.',
      author: {
        name: '사용자2',
        username: 'user2',
        avatar: 'https://example.com/avatar2.jpg',
        initials: 'U2'
      },
      createdAt: '2023-09-08',
      likes: 15,
      comments: 8,
      followers: '2K',
      following: '750',
      description: 'UI/UX 디자이너'
    },
  ];
}

export default async function HotTopicPage() {
  const feeds = await getFeeds();

  return (
    <main className="col-span-5 w-full border-x border-slate-200">
      <Header title="Hot Topic" />
      <FeedList feeds={feeds} />
      <CreateFeedButton />
    </main>
  );
}