// @components/DMProduct.tsx
import React from 'react';

interface DMProductProps {
  id: number;
  senderName: string;
  receiverName: string;
  messageContent: string;
  isRead: boolean;
  sentAt: string;
  onReadUpdate: (id: number) => void;
}

const DMProduct: React.FC<DMProductProps> = ({ id, senderName, receiverName, messageContent, isRead, sentAt, onReadUpdate }) => {
  return (
    <div className="py-2">
      <div className="flex justify-between">
        <div className="font-bold">{senderName} → {receiverName}</div>
        <div className="text-sm text-gray-500">{sentAt}</div>
      </div>
      <div className="text-sm">{messageContent}</div>
      {!isRead && (
        <button onClick={() => onReadUpdate(id)} className="text-blue-500 text-sm mt-2">
          Mark as Read
        </button>
      )}
    </div>
  );
};

export default DMProduct;
