// @components/DMItem.tsx
import React from 'react';

interface DMItemProps {
  senderName: string;
  messageContent: string;
  sentAt: string;
}

const DMItem: React.FC<DMItemProps> = ({ senderName, messageContent, sentAt }) => {
  return (
    <li className="py-2">
      <div className="font-bold">{senderName}</div>
      <div className="text-sm">{messageContent}</div>
      <div className="text-xs text-gray-500">{sentAt}</div>
    </li>
  );
};

export default DMItem;
