import React from 'react';
import Account from './Account'; // Account 컴포넌트
import { formatDate } from '@util/Date';

interface DMListItemProps {
  userName: string;
  avatarUrl: string;
  displayName: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageRead: boolean;
  onClick: () => void;
}

const DMListItem: React.FC<DMListItemProps> = ({
  userName,
  avatarUrl,
  displayName,
  lastMessage,
  lastMessageTime,
  lastMessageRead,
  onClick,
}) => {
  return (
    <div
      className="flex items-center justify-between p-4 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      {/* 좌측의 사용자 정보 */}
      <div className="flex items-center">
        <Account
          className="mr-4"
          userName={userName}
          avatarUrl={avatarUrl}
          displayName={displayName}
        />
        <div className="ml-4">
          <p className="text-sm text-gray-500">{lastMessage}</p>
        </div>
      </div>

      {/* 우측의 메시지 정보 */}
      <div className="flex flex-col items-end">
        <p className="text-sm text-gray-400">{formatDate(lastMessageTime)}</p>
        {lastMessageRead ? (
          <p className="text-xs text-gray-500">읽음</p>
        ) : (
          <p className="text-xs text-blue-500">읽지 않음</p>
        )}
      </div>
    </div>
  );
};

export default DMListItem;
