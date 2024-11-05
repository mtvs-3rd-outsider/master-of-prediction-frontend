"use client";
import React from "react";
import { useRouter } from "next/navigation";
import apiClient from "@handler/fetch/axios";
import Account from "./Account";
import useUserStore from "@store/useUserStore";
import { Swiper, SwiperSlide } from "swiper/react"; // Swiper import
import { UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import "swiper/swiper-bundle.css"; // Swiper 스타일 import
import { Button } from "@nextui-org/button";
import toast from "react-hot-toast";
import { RoomInfo } from "@store/useMessageStore";
import { ParticipantDTO } from "./ChatList";
import { useDMListStore } from "@store/useDMListStore";

interface SearchResultsProps {
  status: string;
  search: any;
  infiniteErrorSearch: any;
  fetchNextPageSearch: () => void;
  hasNextPageSearch: boolean;
  isFetchingNextPageSearch: boolean;
}

interface SelectedUser {
  id: number;
  displayName: string;
  userName: string;
}

interface CreateChatThreadDTO {
  isGroupThread: boolean;
  participantIds: number[];
}

interface CreateChatThreadResponse {
  chatRoomId: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  status,
  search,
  infiniteErrorSearch,
  fetchNextPageSearch,
  hasNextPageSearch,
  isFetchingNextPageSearch,
}) => {
  const userInfo = useUserStore((state) => state.userInfo);
  const router = useRouter();

  const [isGroupMode, setIsGroupMode] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<SelectedUser[]>([]);
  const { dmlist, setDMLIst } = useDMListStore(); // zustand store에서 가져오기
  const handleResultClick = (
    userId: number,
    displayName: string,
    userName: string
  ) => {
    if (isGroupMode) {
      setSelectedUsers((prev) =>
        prev.some((user) => user.id == userId)
          ? prev.filter((user) => user.id != userId)
          : [...prev, { id: userId, displayName, userName }]
      );
    } else {
      // `SelectedUser` 타입 배열로 전달
      createChatThread([{ id: userId, displayName, userName }]);
    }
  };
  const createChatThread = async (participantIds: SelectedUser[]) => {
    try {
      const requestData: CreateChatThreadDTO = {
        isGroupThread: participantIds.length > 2,
        participantIds: [
          Number(userInfo!.id),
          ...participantIds.map((user) => user.id),
        ],
      };
      const response = await apiClient.post<CreateChatThreadResponse>(
        "/chat-threads/create",
        requestData
      );
      const roomId = response.data.chatRoomId;;

      // 단일 채팅방과 그룹 채팅방에 따라 roomName 설정
      const roomName = requestData.isGroupThread
        ? participantIds.map((user) => user.displayName).join(", ")
        : participantIds[0]?.displayName || "New Chat";

      // participants를 SelectedUser[]로 설정
      const participants: ParticipantDTO[] = participantIds.map((user) => ({
        userId: user.id,
        userName: user.userName,
        avatarUrl: "", // 기본 아바타 URL
        displayName: user.displayName,
        unreadMessageCount: 0, // 초기 읽지 않은 메시지 개수
      }));

      const newRoom: RoomInfo = {
        roomId,
        roomName,
        lastMessage: "",
        lastMessageTime: new Date().toISOString(),
        unreadMessageCount: 0,
        userId: userInfo!.id!.toString(),
        participants,
        isGroupThread: requestData.isGroupThread,
      };
      // dmList가 null 또는 undefined일 때만 설정
      // dmlist에 roomId가 없을 때만 추가
      console.log(newRoom);
      setDMLIst((prevDMList) => {
        if (!prevDMList[roomId]) {
          return { ...prevDMList, [roomId]: newRoom };
        }
        return prevDMList;
      });
      console.log(dmlist)
      router.push(`/messages/${roomId}`);
    } catch (error) {
      console.error("Failed to create chat thread:", error);
    }
  };

  const handleCreateGroupChat = () => {
    if (selectedUsers.length >= 2) {
      // 2명 이상일 경우에만 그룹 생성
      createChatThread(selectedUsers.map((user) => user));
    } else {
      toast.error("그룹 채팅은 최소 2명 이상의 사용자가 필요합니다.");
    }
  };
  const toggleGroupMode = () => {
    setIsGroupMode(!isGroupMode);
    setSelectedUsers([]);
  };

  const removeSelectedUser = (userId: number) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "error") return <p>Error: {infiniteErrorSearch.message}</p>;

  return (
    <div>
      <div className="flex justify-between items-center">
        <Button
          color="primary"
          variant="light"
          startContent={<UserIcon className="h-5 w-5" />}
          onClick={toggleGroupMode}
          className="mx-2 mt-2"
        >
          {isGroupMode ? "그룹 취소" : "그룹 만들기"}
        </Button>
        <Button
          color="primary"
          variant="light"
          className="mx-2  mt-2"
          onClick={handleCreateGroupChat}
          disabled={!isGroupMode || selectedUsers.length === 0}
        >
          완료
        </Button>
      </div>

      {isGroupMode && selectedUsers.length > 0 && (
        <div className="flex items-center mb-4 space-x-2">
          <span className="whitespace-nowrap m-2">받는 사람:</span>
          <Swiper spaceBetween={8} slidesPerView="auto" freeMode={true}>
            {selectedUsers.map((user) => (
              <SwiperSlide key={user.id} style={{ width: "auto" }}>
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-lg flex items-center">
                  {user.displayName}
                  <button
                    onClick={() => removeSelectedUser(user.id)}
                    className="ml-1"
                  >
                    <XMarkIcon className="h-4 w-4 text-red-500" />
                  </button>
                </span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <ul className="divide-y divide-slate-200">
        {search?.pages.map((page: any, pageIndex: number) => (
          <React.Fragment key={pageIndex}>
            {page.content
              .filter((result: any) => result.user_id != userInfo?.id) // 자신 제외
              .map((result: any) => (
                <div
                  key={result.user_id}
                  className={`cursor-pointer ${
                    selectedUsers.some((user) => user.id === result.user_id)
                      ? "bg-blue-100"
                      : ""
                  }`}
                  onClick={() =>
                    handleResultClick(
                      result.user_id,
                      result.display_name,
                      result.user_name
                    )
                  }
                >
                  <Account
                    className="px-2 py-2"
                    userName={result.user_name}
                    avatarUrl={result.avatar_img}
                    displayName={result.display_name}
                    tier={result.tier}
                  />
                </div>
              ))}
          </React.Fragment>
        ))}
        {isFetchingNextPageSearch && <p>Loading more...</p>}
      </ul>
    </div>
  );
};

export default SearchResults;
