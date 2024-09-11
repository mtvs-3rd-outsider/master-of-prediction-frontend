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

interface FeedFormProps {
  onSubmit: (content: string, media: MediaItem[]) => void;
}

interface MediaItem {
  type: 'image' | 'video' | 'youtube';
  url: string;
}

const YouTubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" fill="currentColor"/>
  </svg>
);

const FeedForm: React.FC<FeedFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isYoutubeInputOpen, setIsYoutubeInputOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(content, media);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && media.length < 4) {
      Array.from(files).slice(0, 4 - media.length).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setMedia(prev => [...prev, {
            type: file.type.startsWith('image/') ? 'image' : 'video',
            url: result
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleYoutubeUrlSubmit = () => {
    if (youtubeUrl && media.length < 4) {
      setMedia(prev => [...prev, { type: 'youtube', url: youtubeUrl }]);
      setYoutubeUrl('');
      setIsYoutubeInputOpen(false);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
   <div className="flex justify-between items-center mb-4 relative">
  <BackButton/>
  <h1 className="text-lg font-bold absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">새 게시물 작성</h1>
  <Button type="submit" color="primary" radius='full' className="h-7" size='sm'>
    게시하기
  </Button>
</div>
      <div className="flex space-x-2 mb-4">
        <Button
          isIconOnly={true}
          onClick={() => fileInputRef.current?.click()}
          startContent={<CameraIcon className="h-5 w-5" />}
          disabled={media.length >= 4}
          className='x-1 bg-white'
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*"
          multiple
          hidden
        />
        {isYoutubeInputOpen ? (
          <div className="flex-grow flex space-x-2">
            <Input
              placeholder="YouTube URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="flex-grow"
            />
            <Button size="sm" onClick={handleYoutubeUrlSubmit} disabled={media.length >= 4}>
              추가
            </Button>
            <Button size="sm" onClick={() => setIsYoutubeInputOpen(false)}>
              취소
            </Button>
          </div>
        ) : (
          <Button
            isIconOnly={true}
            onClick={() => setIsYoutubeInputOpen(true)}
            startContent={<YouTubeIcon />}
            disabled={media.length >= 4}
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
        classNames={{
          input: "border-l-0 border-r-0 rounded-none bg-white",
          inputWrapper: "border-l-0 border-r-0 rounded-none shadow-none bg-white"
        }}
      />

      {media.length > 0 && (
        <Swiper
          slidesPerView="auto"
          spaceBetween={30}
          modules={[FreeMode]}
          className="mySwiper"
        >
          {media.map((item, index) => (
            <SwiperSlide key={index} style={{ width: 'auto', height: '200px' }} className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveMedia(index);
                }}
                className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-1"
              >
                <XMarkIcon className="h-5 w-5 text-white" />
              </button>
              {item.type === 'image' && (
                <img src={item.url} alt={`Uploaded ${index}`} className="h-full w-auto object-cover rounded-[20px]" />
              )}
              {item.type === 'video' && (
                <video src={item.url} controls className="h-full w-auto object-cover rounded-[20px]" />
              )}
              {item.type === 'youtube' && (
                <iframe
                  width="auto"
                  height="100%"
                  src={`https://www.youtube.com/embed/${item.url.split('v=')[1]}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-[20px]"
                ></iframe>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </form>
  );
};

export default FeedForm;