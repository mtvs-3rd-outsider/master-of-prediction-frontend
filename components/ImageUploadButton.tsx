import React from 'react';
import { Button } from '@nextui-org/button';
import { CameraIcon } from '@heroicons/react/24/outline';

interface ImageUploadButtonProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({ onChange, multiple = false }) => {
  return (
    <Button
      as="label"
      color="primary"
      variant="flat"
      startContent={<CameraIcon className="h-6 w-6" />}
    >
      <input
        type="file"
        hidden
        onChange={onChange}
        accept="image/*"
        multiple={multiple}
      />
    </Button>
  );
};

export default ImageUploadButton;


