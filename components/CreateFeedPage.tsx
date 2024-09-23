"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FeedForm from '@components/FeedForm';
import useUserStore from '@store/useUserStore';
import { sendMultipartForm } from '@/handler/fetch/axios';

export default function CreateFeedPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userInfo = useUserStore((state) => state.userInfo);

  const handleSubmit = async (content: string, media: File[], youtubeUrls: string[]) => {
    if (!userInfo) {
      alert('로그인이 필요합니다.');
      return;
    }
  
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const feedData = {
        authorType: 'USER',
        title: content.substring(0, 50),
        content,
        channelType: 'MYCHANNEL',
        user: {
          userId: userInfo.id
        }
      };
  
      formData.append('feedData', new Blob([JSON.stringify(feedData)], { type: 'application/json' }));
      
      media.forEach((file) => {
        formData.append('files', file);
      });

      // YouTube URL들을 FormData에 추가
      youtubeUrls.forEach((url, index) => {
        formData.append(`youtubeUrls`, url);
      });
  
      const response = await sendMultipartForm('/feeds', formData, 'post');
  
      if (response.status < 300) {
        router.push('/hot-topic');
      } else {
        throw new Error(response.data.message || '피드 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error creating feed:', error);
      alert(error instanceof Error ? error.message : '피드 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return <FeedForm onSubmit={handleSubmit} />;
}