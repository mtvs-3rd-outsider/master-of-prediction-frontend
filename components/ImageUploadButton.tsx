
import React from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';

const ImageUploadButton: React.FC = () => {
  return (
    <button type="button" className="p-2 rounded-full hover:bg-gray-100">
      <CameraIcon className="h-6 w-6 text-gray-500" />
    </button>
  );
};

export default ImageUploadButton;