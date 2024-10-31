import React, { useState } from "react";
import Account from "./Account";
import { formatDate } from "@util/Date";
import { ParticipantDTO } from "./ChatList";
import useUserStore from "@store/useUserStore";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { EllipsisHorizontalIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/button";

interface ChatItemProps {
  participants: ParticipantDTO[];
  isGroupThread: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessageCount: number;
  onClick: () => void;
  onDelete: () => void; // 삭제 기능 추가
}

const ChatItem: React.FC<ChatItemProps> = ({
  participants,
  isGroupThread,
  lastMessage,
  lastMessageTime,
  unreadMessageCount,
  onClick,
  onDelete,
}) => {
  const { userInfo } = useUserStore();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // 그룹 채팅이 아닌 경우, 현재 사용자를 제외한 상대방 프로필만 표시
  const filteredParticipants = participants.filter(
    (participant) => participant.userId.toString() != userInfo?.id
  );

  return (
    <div
      className="flex items-center w-full justify-between p-4 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      <div className="flex items-center">
        {isGroupThread ? (
          <>
            {/* 그룹 아이콘 및 참여자 드롭다운 */}
            <Dropdown isOpen={isDropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  className="text-gray-400 rounded-full hover:text-gray-600 ml-2"
                >
                  <UsersIcon className="h-15 w-15" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Participants">
                {filteredParticipants.map((participant) => (
                  <DropdownItem key={participant.userId}>
                    {participant.displayName}@{participant.userName}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <div className="ml-2 text-sm font-medium text-gray-800">
              {`${filteredParticipants[0]?.displayName} 외 ${
                filteredParticipants.length - 1
              }명`}
            </div>
          </>
        ) : (
          // 그룹 채팅이 아닌 경우 상대방 프로필만 표시
          filteredParticipants.map((participant) => (
            <Account
              key={participant.userId}
              className="mr-4"
              userName={participant.userName}
              avatarUrl={participant.avatarUrl}
              displayName={participant.displayName}
            />
          ))
        )}
        <div className="ml-4">
          <p className="text-sm text-gray-500">{lastMessage}</p>
          {unreadMessageCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2">
              {unreadMessageCount}
            </span>
          )}
        </div>
      </div>

      {/* 메시지 날짜 표시 */}
      {/* Date and Options Dropdown */}
      <div className="flex flex-col items-end">
        <p className="text-sm text-gray-400">{formatDate(lastMessageTime)}</p>
        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              variant="light"
              className="text-gray-400 hover:text-gray-600"
            >
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Chat Actions">
            <DropdownItem key="delete" color="danger" onClick={onDelete}>
              Delete Chat
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default ChatItem;
