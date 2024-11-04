import React from 'react';
import Image from 'next/image';

interface MediaGridProps {
  mediaFiles: string[];
  youtubeUrls: string[];
  id: string;
  isQuote?: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({ mediaFiles, youtubeUrls, id, isQuote = false }) => {
  const allMedia = [...mediaFiles, ...youtubeUrls];
  const gridClassName = (length: number) => {
    switch (length) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-2";
      default: return "grid-cols-2";
    }
  };

  // 인용된 경우의 컨테이너 높이 조절
  const containerHeight = isQuote ? "150px" : "200px";
  const aspectRatio = allMedia.length === 1 ? "aspect-video" : "aspect-square";

  const isVideoFile = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.webm'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  return (
    <div className={`grid ${gridClassName(allMedia.length)} gap-1 w-full ${isQuote ? 'max-w-[600px]' : ''}`}>
      {mediaFiles.map((file, index) => (
        <div 
          key={`${id}-media-${index}`} 
          className={`relative ${aspectRatio} ${allMedia.length === 3 && index === 0 ? "col-span-2" : ""}`}
          style={{ 
            minHeight: containerHeight,
            maxHeight: isQuote ? containerHeight : 'none'
          }}
        >
          {isVideoFile(file) ? (
            <video
              src={file}
              controls
              className={`w-full h-full object-cover rounded-lg ${isQuote ? 'max-h-[150px]' : ''}`}
              onError={(e) => console.error('Video load error:', e, file)}
            />
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={file}
                alt={`Post media ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className={`rounded-lg ${isQuote ? 'scale-90' : ''}`}
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
          style={{ 
            minHeight: containerHeight,
            maxHeight: isQuote ? containerHeight : 'none'
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeVideoId(url)}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={`w-full h-full rounded-lg ${isQuote ? 'scale-90' : ''}`}
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