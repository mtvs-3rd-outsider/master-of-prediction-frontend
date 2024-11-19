"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FeedForm from '@components/FeedForm';
import useUserStore from '@store/useUserStore';
import { getFeedById } from '@/handler/feedApi';
import { FeedResponseDTO } from '@components/types/feedResponseDTO';
import GuestLoginModal from '@components/GuestLoginModal';
import axios from '@/handler/fetch/axios';

export default function CreateFeedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteFeed, setQuoteFeed] = useState<FeedResponseDTO | null>(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [guestInfo, setGuestInfo] = useState<{guestId: string, guestPassword: string} | null>(null);
  const [pendingPostData, setPendingPostData] = useState<{
    content: string;
    media: File[];
    youtubeUrls: string[];
  } | null>(null);
  const userInfo = useUserStore((state) => state.userInfo);
  const [feedChannelId, setFeedChannelId] = useState<string | null>(searchParams?.get('channelId'));
  const [feedChannelType, setFeedChannelType] = useState<string | null>(searchParams?.get('channelType'));

  const quoteId = searchParams?.get('quoteId');
 // 인용하기인 경우 channel 정보 설정
 useEffect(() => {
  const quoteId = searchParams?.get('quoteId');
  if (quoteId && userInfo?.id) {
    // 인용하기이면서 로그인된 사용자인 경우
    setFeedChannelId(String(userInfo.id));
    setFeedChannelType('MYCHANNEL');
  } else {
    // 일반 게시글인 경우 URL의 파라미터 사용
    setFeedChannelId(searchParams?.get('channelId'));
    setFeedChannelType(searchParams?.get('channelType'));
  }
}, [searchParams, userInfo]);

// 인용할 게시글 로드 (기존 코드)
useEffect(() => {
  const quoteId = searchParams?.get('quoteId');
  if (quoteId) {
    getFeedById(parseInt(quoteId))
      .then(feed => {
        console.log('Loaded quote feed:', feed);
        setQuoteFeed(feed);
      })
      .catch(error => {
        console.error('Error loading quote feed:', error);
        alert('인용할 게시글을 불러오는데 실패했습니다.');
      });
  }
}, [quoteId]);


  const handleGuestLogin = async (guestId: string, guestPassword: string) => {
    setGuestInfo({ guestId, guestPassword });
    setIsGuestModalOpen(false);

    if (pendingPostData) {
      await createPost(
        pendingPostData.content,
        pendingPostData.media,
        pendingPostData.youtubeUrls,
        { guestId, guestPassword }
      );
      setPendingPostData(null);
    }
  };

  const createPost = async (
    content: string,
    media: File[],
    youtubeUrls: string[],
    guestData?: { guestId: string; guestPassword: string }
  ) => {
    if (!feedChannelId || !feedChannelType) {
      alert('채널 정보가 없습니다.');
      return;
    }
  
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const feedData = {
        authorType: userInfo ? 'USER' : 'GUEST',
        title: content.substring(0, 50),
        content,
        user: userInfo ? {
          userId: userInfo.id
        } : null,
        guest: guestData || null,
        channel: {
          channelId: Number(feedChannelId),
          channelType: feedChannelType
        },
        mediaFileUrls: [],
        youtubeUrls: youtubeUrls,
        isQuote: !!quoteFeed,
        quoteFeed: quoteFeed ? {
          quoteId: quoteFeed.id,
          quoteContent: quoteFeed.content,
          quoteCreateAt: quoteFeed.createdAt,
          mediaFileUrls: quoteFeed.mediaFiles?.map(file => file.fileUrl) || [],
          youtubeUrls: quoteFeed.youTubeVideos?.map(video => video.youtubeUrl) || [],
          quoteUser: quoteFeed.user,
          quoteGuest: quoteFeed.guest
        } : null
      };
  
      formData.append('feedData', new Blob([JSON.stringify(feedData)], { type: 'application/json' }));
      media.forEach(file => formData.append('files', file));
      youtubeUrls.forEach(url => formData.append('youtubeUrls', url));
  
      console.log('Submitting feed data:', feedData);
  
      let response;
      if (quoteId) {
        // 인용하기인 경우
        response = await axios.post(`/feeds/${quoteId}/quote`, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data'
          },
        });
      } else {
        // 일반 게시글인 경우
        response = await axios.post('/feeds', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data'
          },
        });
      }
  
      if (response.status < 300) {
        router.push('/hot-topic');
      }
    } catch (error) {
      console.error('Error creating feed:', error);
      alert(error instanceof Error ? error.message : '피드 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSubmit = async (content: string, media: File[], youtubeUrls: string[]) => {
    if (userInfo) {
      await createPost(content, media, youtubeUrls);
    } else {
      setPendingPostData({ content, media, youtubeUrls });
      setIsGuestModalOpen(true);
    }
  };
  useEffect(() => {
    console.log('Channel ID:', feedChannelId);
    console.log('Channel Type:', feedChannelType);
    console.log('Quote ID:', quoteId);
    console.log('Quote Feed:', quoteFeed);
    console.log('Is Quote Post:', !!quoteId);
  }, [feedChannelId, feedChannelType, quoteId, quoteFeed]);

  return (
    <div className="space-y-4">
      <FeedForm 
        onSubmit={handleSubmit} 
        quoteFeed={quoteFeed} 
        isSubmitting={isSubmitting}
      />

      <GuestLoginModal
        isOpen={isGuestModalOpen}
        onOpenChange={setIsGuestModalOpen}
        onSubmit={handleGuestLogin}
      />
    </div>
  );
}