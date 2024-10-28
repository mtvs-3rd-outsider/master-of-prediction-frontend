import React from 'react';
import Account from './Account'; // Account 컴포넌트
import { formatDate } from '@util/Date';
import { ParticipantDTO } from './ChatList';
import useUserStore from '@store/useUserStore';

interface ChatItemProps {
  participants: ParticipantDTO[];
  isGroupThread: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessageCount: number;
  onClick: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  participants,
  isGroupThread,
  lastMessage,
  lastMessageTime,
  unreadMessageCount,
  onClick,
}) => {
  const { userInfo } = useUserStore(); // 현재 사용자 정보 가져오기

  // 참여자가 두 명이면 본인을 제외한 상대방만 표시하도록 필터링
  const filteredParticipants = participants.length === 2 
    ? participants.filter(participant => participant.userId.toString() != userInfo?.id)
    : participants;

  return (
    <div
      className="flex items-center justify-between p-4 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      {/* 좌측의 사용자 정보 */}
      <div className="flex items-center">
        {filteredParticipants.map((participant, index) => (
          <Account
            key={participant.userId}
            className={`mr-4 ${index > 0 && isGroupThread ? 'inline-block' : 'block'}`}
            userName={participant.userName}
            avatarUrl={participant.avatarUrl}
            displayName={participant.displayName}
          />
        ))}
        <div className="ml-4">
          <p className="text-sm text-gray-500">{lastMessage}</p>
          {unreadMessageCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2">
              {unreadMessageCount}
            </span>
          )}
        </div>
      </div>

      {/* 우측의 메시지 정보 */}
      <div className="flex flex-col items-end">
        <p className="text-sm text-gray-400">{formatDate(lastMessageTime)}</p>
      </div>
    </div>
  );
};

export default ChatItem;
