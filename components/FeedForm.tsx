"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@nextui-org/button';
import BackButton from '@components/BackButton';
import { Textarea, Input } from '@nextui-org/input';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode } from 'swiper/modules';
import Image from "next/image";
import QuotePost from '@ui/QuotePost';
import { FeedResponseDTO } from '@components/types/feedResponseDTO';

interface FeedFormProps {
  onSubmit: (content: string, media: File[], youtubeUrls: string[]) => void;
  quoteFeed?: FeedResponseDTO | null;
  isSubmitting: boolean;
}

const YouTubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" fill="currentColor"/>
  </svg>
);

const FeedForm: React.FC<FeedFormProps> = ({ onSubmit, quoteFeed, isSubmitting }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File[]>([]);
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>([]);
  const [currentYoutubeUrl, setCurrentYoutubeUrl] = useState('');
  const [isYoutubeInputOpen, setIsYoutubeInputOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return; // 내용이 비어있거나 제출 중이면 리턴
    onSubmit(content, media, youtubeUrls);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && media.length + youtubeUrls.length < 4) {
      const newMedia = Array.from(files).slice(0, 4 - media.length - youtubeUrls.length);
      setMedia(prev => [...prev, ...newMedia]);
    }
  };

  const handleYoutubeUrlSubmit = () => {
    if (currentYoutubeUrl && media.length + youtubeUrls.length < 4) {
      setYoutubeUrls(prev => [...prev, currentYoutubeUrl]);
      setCurrentYoutubeUrl('');
      setIsYoutubeInputOpen(false);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveYoutubeUrl = (index: number) => {
    setYoutubeUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-4 relative p-4">
        <BackButton size="lg"/>
        <h1 className="text-lg font-bold absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          새 게시물 작성
        </h1>
        <Button 
          type="submit" 
          color="primary" 
          radius='full' 
          className="h-7" 
          size='sm'
          isDisabled={!content.trim() || isSubmitting} // 내용이 비어있거나 제출 중일 때 비활성화
        >
          {isSubmitting ? '게시중...' : '게시하기'}
        </Button>
      </div>

      <div className="flex space-x-2 mb-4">
        <Button
          isIconOnly={true}
          onClick={() => fileInputRef.current?.click()}
          startContent={<CameraIcon className="h-5 w-5" />}
          isDisabled={media.length + youtubeUrls.length >= 4 || isSubmitting}
          className='x-1 bg-white'
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*"
          multiple
          hidden
          disabled={isSubmitting}
        />
        {isYoutubeInputOpen ? (
          <div className="flex-grow flex space-x-2">
            <Input
              placeholder="YouTube URL"
              value={currentYoutubeUrl}
              onChange={(e) => setCurrentYoutubeUrl(e.target.value)}
              className="flex-grow"
              isDisabled={isSubmitting}
            />
            <Button 
              size="sm" 
              onClick={handleYoutubeUrlSubmit} 
              isDisabled={media.length + youtubeUrls.length >= 4 || isSubmitting}
            >
              추가
            </Button>
            <Button 
              size="sm" 
              onClick={() => setIsYoutubeInputOpen(false)}
              isDisabled={isSubmitting}
            >
              취소
            </Button>
          </div>
        ) : (
          <Button
            isIconOnly={true}
            onClick={() => setIsYoutubeInputOpen(true)}
            startContent={<YouTubeIcon />}
            isDisabled={media.length + youtubeUrls.length >= 4 || isSubmitting}
            className='x-1 bg-white'
          />
        )}
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="무슨 일이 일어나고 있나요?"
        className="w-full m-0"
        minRows={1}
        maxRows={10}
        isDisabled={isSubmitting}
        classNames={{
          input: "border-l-0 border-r-0 rounded-none bg-white",
          inputWrapper: "border-l-0 border-r-0 rounded-none shadow-none bg-white"
        }}
      />

      {(media.length > 0 || youtubeUrls.length > 0) && (
        <Swiper
          slidesPerView="auto"
          spaceBetween={30}
          modules={[FreeMode]}
          className="mySwiper"
        >
          {media.map((file, index) => (
            <SwiperSlide key={`media-${index}`} style={{ width: 'auto', height: '200px' }} className="relative">
              <button
                type="button"
                onClick={() => handleRemoveMedia(index)}
                className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-1"
                disabled={isSubmitting}
              >
                <XMarkIcon className="h-5 w-5 text-white" />
              </button>
              {file.type.startsWith('image/') ? (
                <Image src={URL.createObjectURL(file)} alt={`Uploaded ${index}`} width={200} height={200} className="object-cover rounded-[20px]" />
              ) : (
                <video src={URL.createObjectURL(file)} controls className="h-full w-auto object-cover rounded-[20px]" />
              )}
            </SwiperSlide>
          ))}
          {youtubeUrls.map((url, index) => (
            <SwiperSlide key={`youtube-${index}`} style={{ width: 'auto', height: '200px' }} className="relative">
              <button
                type="button"
                onClick={() => handleRemoveYoutubeUrl(index)}
                className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-1"
                disabled={isSubmitting}
              >
                <XMarkIcon className="h-5 w-5 text-white" />
              </button>
              <iframe
                width="200"
                height="200"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(url)}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-[20px]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {quoteFeed && (
        <div className="mt-4">
          <QuotePost 
            quoteId={quoteFeed.id}
            quoteContent={quoteFeed.content}
            quoteCreateAt={quoteFeed.createdAt}
            quoteUser={quoteFeed.user||null}
            quoteGuest={quoteFeed.guest||null}
            mediaFileUrls={quoteFeed.mediaFiles?.map(file => file.fileUrl) || []}
            youtubeUrls={quoteFeed.youTubeVideos?.map(video => video.youtubeUrl) || []}
            onClick={() => {}} // 작성 폼에서는 클릭 동작 불필요
          />
        </div>
      )}
    </form>
  );
};

function getYouTubeVideoId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

export default FeedForm;