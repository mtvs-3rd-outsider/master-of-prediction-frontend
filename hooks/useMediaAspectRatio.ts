import { useState, useEffect } from 'react';
import { isVideoFile } from '@util/fileUtils';

const useMediaAspectRatio = (src: string) => {
  const [aspectRatio, setAspectRatio] = useState<'landscape' | 'portrait' | 'square'>('landscape');

  useEffect(() => {
    const determineAspectRatio = (width: number, height: number) => {
      const ratio = width / height;
      if (ratio > 1.01) return 'landscape';
      if (ratio < 0.99) return 'portrait';
      return 'square';
    };

    if (isVideoFile(src)) {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        setAspectRatio(determineAspectRatio(video.videoWidth, video.videoHeight));
      };
      video.src = src;
    } else {
      const img = new Image();
      img.onload = () => {
        setAspectRatio(determineAspectRatio(img.width, img.height));
      };
      img.src = src;
    }
  }, [src]);

  return aspectRatio;
};

export default useMediaAspectRatio;
