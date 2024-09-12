import React from 'react';
import Image from 'next/image';

interface MediaGridProps {
  mediaFiles: string[];
  youtubeUrls: string[];
  id: string;
}

const MediaGrid: React.FC<MediaGridProps> = ({ mediaFiles, youtubeUrls, id }) => {
  const allMedia = [...mediaFiles, ...youtubeUrls];
  const gridClassName = (length: number) => {
    switch (length) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-2";
      default: return "grid-cols-2";
    }
  };

  const aspectRatio = allMedia.length === 1 ? "aspect-video" : "aspect-square";

  const isVideoFile = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.webm'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  return (
    <div className={`grid ${gridClassName(allMedia.length)} gap-1 w-full`}>
      {mediaFiles.map((file, index) => (
        <div 
          key={`${id}-media-${index}`} 
          className={`relative ${aspectRatio} ${allMedia.length === 3 && index === 0 ? "col-span-2" : ""}`}
          style={{ minHeight: '200px' }} // 최소 높이 추가
        >
          {isVideoFile(file) ? (
            <video
              src={file}
              controls
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => console.error('Video load error:', e, file)}
            />
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={file}
                alt={`Post media ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                onError={(e) => console.error('Image load error:', e, file)}
              />
            </div>
          )}
        </div>
      ))}
      {youtubeUrls.map((url, index) => (
        <div 
          key={`${id}-youtube-${index}`} 
          className={`relative ${aspectRatio} ${allMedia.length === 3 && mediaFiles.length + index === 0 ? "col-span-2" : ""}`}
          style={{ minHeight: '200px' }} // 최소 높이 추가
        >
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeVideoId(url)}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
          />
        </div>
      ))}
    </div>
  );
};

function getYouTubeVideoId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

export default MediaGrid;