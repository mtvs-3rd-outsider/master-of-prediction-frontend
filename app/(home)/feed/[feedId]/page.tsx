"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Post from '@ui/Post';
import BackButton from '@components/BackButton';

// 이 부분은 실제 데이터를 가져오는 로직으로 대체되어야 합니다.
const mockFeedData = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  content: 'This is a sample feed content.',
  date: '2h',
  src: 'https://example.com/avatar.jpg',
  initials: 'JD',
  description: 'Sample description',
  followers: '1000',
  following: '500',
  viewCount: '150', // viewCount 필드 추가
};

export default function FeedDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // 실제로는 이 부분에서 params.id를 사용하여 서버로부터 데이터를 가져와야 합니다.
  const feedData = mockFeedData;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <BackButton />
      <div className="my-4">
        <Post {...feedData} />
      </div>
      <div className="mt-8 border-t pt-4">
        <h2 className="text-xl font-bold mb-4">댓글</h2>
        <div className="bg-gray-100 h-64 rounded-lg p-4 overflow-y-auto">
          {/* 여기에 실제 채팅/댓글 컴포넌트가 들어갑니다 */}
          <p className="text-gray-500">댓글이 없습니다.</p>
        </div>
      </div>
    </div>
  );
}