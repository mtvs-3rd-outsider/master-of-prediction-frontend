"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FeedForm from '@components/FeedForm';
import useUserStore from '@store/useUserStore';
import { getFeedById } from '@/handler/feedApi';
import { FeedResponseDTO } from '@components/types/feedResponseDTO';
import axios from '@handler/fetch/axios';

export default function CreateFeedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteFeed, setQuoteFeed] = useState<FeedResponseDTO | null>(null);
  const userInfo = useUserStore((state) => state.userInfo);

  // 인용할 게시글 ID가 있으면 해당 게시글 정보를 가져옴
  React.useEffect(() => {
    const quoteId = searchParams?.get('quoteId');
    if (quoteId) {
      getFeedById(parseInt(quoteId))
        .then(feed => setQuoteFeed(feed))
        .catch(console.error);
    }
  }, [searchParams]);

  const handleSubmit = async (content: string, media: File[], youtubeUrls: string[]) => {
    if (!userInfo) {
      alert('로그인이 필요합니다.');
      return;
    }
  
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // 인용하기인 경우
      if (quoteFeed) {
        const quoteData = {
          content,
          channel: {
            channelId: userInfo.id,
            channelType: 'MYCHANNEL'
          },
          user: {
            userId: userInfo.id
          }
        };

        formData.append('feedData', new Blob([JSON.stringify(quoteData)], { type: 'application/json' }));
        
        // 파일과 YouTube URL 추가
        if (media.length > 0) {
          media.forEach(file => formData.append('files', file));
        }
        if (youtubeUrls.length > 0) {
          youtubeUrls.forEach(url => formData.append('youtubeUrls', url));
        }

        const response = await axios.post(
          `/feeds/${quoteFeed.id}/quote`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.status < 300) {
          router.push('/hot-topic');
        }
      } 
      // 일반 피드 생성인 경우
      else {
        const feedData = {
          authorType: 'USER',
          title: content.substring(0, 50),
          content,
          channel: {
            channelId: userInfo.id,
            channelType: 'MYCHANNEL'
          },
          user: {
            userId: userInfo.id
          }
        };

        formData.append('feedData', new Blob([JSON.stringify(feedData)], { type: 'application/json' }));
        
        if (media.length > 0) {
          media.forEach(file => formData.append('files', file));
        }
        if (youtubeUrls.length > 0) {
          youtubeUrls.forEach(url => formData.append('youtubeUrls', url));
        }

        const response = await axios.post(
          '/feeds', 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.status < 300) {
          router.push('/hot-topic');
        }
      }
    } catch (error) {
      console.error('Error creating feed:', error);
      alert(error instanceof Error ? error.message : '피드 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FeedForm 
      onSubmit={handleSubmit} 
      quoteFeed={quoteFeed} 
      isSubmitting={isSubmitting}
    />
  );
}
