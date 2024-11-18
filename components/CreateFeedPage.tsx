"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FeedForm from '@components/FeedForm';
import useUserStore from '@store/useUserStore';
import { getFeedById } from '@/handler/feedApi';
import { FeedResponseDTO } from '@components/types/feedResponseDTO';
import axios from '@handler/fetch/axios';
import { ChannelInfo } from './types/channelInfoDTO'; // 타입 정의가 있는 파일 경로 수정

export default function CreateFeedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteFeed, setQuoteFeed] = useState<FeedResponseDTO | null>(null);
  const [channels, setChannels] = useState<ChannelInfo[]>([]); // 채널 정보를 저장
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null); // 선택된 채널 ID
  const userInfo = useUserStore((state) => state.userInfo);

  // 구독 채널 정보를 가져옴
  useEffect(() => {
    const fetchChannels = async () => {
      if (!userInfo) return;

      try {
        const response = await axios.get(`/subscriptions/user/${userInfo.id}/following`, {
          params: { isUserChannel: true, page: 0, size: 15 },
        });
        setChannels(response.data.content); // content 배열에 채널 정보가 있다고 가정
        setSelectedChannel(userInfo.id ? Number(userInfo.id) : null);
      } catch (error) {
        console.error('Failed to fetch channels:', error);
      }
    };

    fetchChannels();
  }, [userInfo]);

  // 인용할 게시글 ID가 있으면 해당 게시글 정보를 가져옴
  useEffect(() => {
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

    if (!selectedChannel) {
      alert('게시글을 작성할 채널을 선택해주세요.');
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
            channelId: selectedChannel,
            channelType: 'MYCHANNEL'
          },
          user: {
            userId: userInfo.id,
          },
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
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        if (response.status < 300) {
          router.push('/hot-topic');
        }
      } 
      // 일반 피드 생성인 경우
      else {
        const selectedChannelInfo = channels.find(channel => channel.channelId === selectedChannel);
        const channelType = selectedChannelInfo?.isUserChannel ? 'MYCHANNEL' : 'CATEGORY';
      
        const feedData = {
          authorType: 'USER',
          title: content.substring(0, 50),
          content,
          channel: {
            channelId: selectedChannel,
            channelType,
          },
          user: {
            userId: userInfo.id,
          },
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
            headers: { 'Content-Type': 'multipart/form-data' },
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
    <div>
      <div>
        <label htmlFor="channel-select">게시글을 작성할 채널:</label>
        <select
          id="channel-select"
          value={selectedChannel || ''}
          onChange={(e) => setSelectedChannel(Number(e.target.value))}
        >
          <option value={userInfo?.id || ''}>내 채널</option>
          {channels.map(channel => (
            <option key={channel.channelId} value={channel.channelId}>
              {channel.displayName}
            </option>
          ))}
        </select>
      </div>
      <FeedForm 
        onSubmit={handleSubmit} 
        quoteFeed={quoteFeed} 
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
