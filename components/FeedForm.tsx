
import React, { useState } from 'react';
import ImageUploadButton from '@components/ImageUploadButton';

interface FeedFormProps {
  initialContent?: string;
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

const FeedForm: React.FC<FeedFormProps> = ({ initialContent = '', onSubmit, onCancel }) => {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(content);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-40 p-2 border rounded-md"
        placeholder="무슨 일이 일어나고 있나요?"
      />
      <div className="flex justify-between items-center">
        <ImageUploadButton />
        <div className="space-x-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md">
            취소
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
            게시
          </button>
        </div>
      </div>
    </form>
  );
};

export default FeedForm;