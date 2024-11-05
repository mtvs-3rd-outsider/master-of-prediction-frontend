"use client";
import React, { useState, useRef, useEffect, ReactNode } from "react";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { ArrowUpIcon, PhotoIcon, UsersIcon } from "@heroicons/react/24/solid";
import { Chip } from "@nextui-org/chip";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import useUserStore from "@store/useUserStore";
import { RSocketClientSetup } from "@/hooks/useRSocketConnection";
import { createMetadata } from "@util/metadataUtils";
import { toUser } from "@util/Converter";
import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@handler/fetch/axios";
import { useInView } from "react-intersection-observer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import moment from "moment";
import Avatar from "./radix/Avatar";
import Link from "next/link";
import Image from "next/image";

import {
  EllipsisHorizontalIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import { FaThumbsUp, FaHeart, FaSmile } from "react-icons/fa"; // 반응 아이콘 임포트
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import Account from "./Account";
import { useRouter } from "next/navigation";
import { useDMListStore } from "@store/useDMListStore";
import { RoomInfo } from "@store/useMessageStore";
type User = {
  name?: string;
  userName?: string;
  avatarImageLink?: string;
  id: string | undefined;
};
export type Message = {
  content: string;
  user: User;
  sent: string;
  roomId: number;
  replyToMessageId: string | null;
  replyContent?: string;
  contentType: string;
  mediaUrl?: string; // mediaType 제거
  id?: number | null;
  reactions?: ReactionVM[]; // reactions 추가
};
export interface ReactionVM {
  reactionId: number; // Reaction unique ID
  reactionType: string; // Type of reaction (like, heart, etc.)
  userId: string; // User ID of the person who reacted
  displayName: string; // Display name of the person who reacted
  userName: string;
  userImg: string;
}

interface ChatUIProps {
  roomId: string;
}
type ReactionCount = { [reactionType: string]: number };
export default function ChatUI({ roomId }: ChatUIProps) {
  const clientRef = useRef<any>(null);
  const { userInfo, token } = useUserStore((state) => ({
    userInfo: state.userInfo,
    token: state.userInfo?.token,
  }));
  const { dmlist } = useDMListStore();
  const [reactions, setReactions] = useState<Record<number, ReactionVM[]>>({}); // 각 메시지에 대한 반응 상태
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null); // 미디어 유형 상태 추가
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [currentRoom] = useState<RoomInfo>(dmlist[roomId]);
  // 그룹 채팅이 아닌 경우, 현재 사용자를 제외한 상대방 프로필만 표시
  const filteredParticipants = currentRoom.participants;
  const [disabledKeysMap, setDisabledKeysMap] = useState<
    Map<number, Set<string>>
  >(new Map());
  interface UserLastReadTimeVM {
    userId: string;
    lastReadTime: string;
    roomId: string;
  }
    console.log(dmlist);
  // 상태 초기화
  const [userLastReadTimes, setUserLastReadTimes] = useState<
    Map<string, UserLastReadTimeVM>
  >(new Map());
  console.log(userLastReadTimes);
  const [message, setMessage] = useState("");
  const sourceRef = useRef<any>(null);
  const sourceRefForReaction = useRef<any>(null);
  const user: User = toUser(userInfo);
  const touchTimeout = useRef<NodeJS.Timeout | null>(null);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    rootMargin: "100px",
    threshold: 0.5,
    triggerOnce: false,
    root: chatContainerRef.current,
  });
  interface MessageReactionVM {
    id: number | null; // 반응 고유 ID, 없을 경우 null
    messageId: number; // 반응이 달린 메시지의 ID
    userId: string; // 반응을 남긴 사용자의 ID
    reactionType: string; // 반응 유형 (예: "like", "heart", "thumbs_up")
    roomId: string; // 반응이 달린 메시지가 포함된 채팅방 ID
    actionType: string; // true일 경우 반응 추가, false일 경우 반응 제거
    displayName: string;
    userName: string;
    userImg: string;
  }

  // 메시지 ref 맵을 저장하는 객체
  const messageRefs = useRef(new Map<number, HTMLDivElement>());
  // scrollToMessage 함수
  const scrollToMessage = (messageId: number) => {
    targetMessageId.current = messageId;
    const messageElement = messageRefs.current.get(messageId);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      targetMessageId.current = null; // 스크롤 완료 시 target 초기화
    } else {
      fetchNextPage(); // 메시지가 없는 경우 다음 페이지 로드
    }
  };
  const router = useRouter();
  //  const handleAddReaction = (messageId, reaction) => {
  //    setReactions((prevReactions) => ({
  //      ...prevReactions,
  //      [messageId]: [...(prevReactions[messageId] || []), reaction],
  //    }));
  //  };
  const targetMessageId = useRef<number | null>(null); // 이동할 메시지 ID
  console.log(messages);
  const fetchDMs = async (pageParam: number) => {
    const response = await apiClient.get(`/messages/room/${roomId}`, {
      params: { page: pageParam, size: 10 },
    });
    return response.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error: infiniteError,
    status,
  } = useInfiniteQuery({
    queryKey: ["chatMessages", roomId],
    queryFn: ({ pageParam = 1 }) => fetchDMs(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      !lastPage.last ? lastPage.number + 1 : undefined,
    enabled: !!userInfo,
  });

  useEffect(() => {
    if (data) {
      const fetchedMessages = data.pages.flatMap((page) => page.content);
      setMessages((prev) => [...fetchedMessages.reverse(), ...prev]);
    }
  }, [data]);
  const handleNewData = (data: any) => {
    console.log("data: ", data);

    // data가 객체일 경우 Map으로 변환
    const dataMap = data instanceof Map ? data : new Map(Object.entries(data));
    setUserLastReadTimes((prevTimes) => {
      const updatedTimes = new Map(prevTimes);
      dataMap.forEach((value: UserLastReadTimeVM, key: string) => {
        updatedTimes.set(key, {
          ...value,
          lastReadTime: value.lastReadTime,
        });
      });

      return updatedTimes;
    });
  };

  useEffect(() => {
    if (userInfo) {
      RSocketClientSetup.init({
        clientRef,
        token,
        channels: [
          { sourceRef: sourceRef, onNext: (x) => x },
          { sourceRef: sourceRefForReaction, onNext: (x) => x },
        ],
        streams: [
          {
            endpoint: `api.v1.messages.stream/${roomId}`,
            onNext: (message: Message) => {
              setMessages((prev) => [...prev, message]);
              if (!!isAtBottom) setShowNewMessageAlert(() => true);
            },
          },
          {
            endpoint: `api.v1.messages.lastReadTimes/${roomId}`,
            onNext: handleNewData,
          },
          {
            endpoint: `api.v1.messages.connect/${roomId}`,
            onNext: (data) => data,
          },
          {
            endpoint: `api.v1.reactions.stream/${roomId}`,
            onNext: (reaction: MessageReactionVM) => {
              setReactions((prevReactions) => {
                const messageReactions =
                  prevReactions[reaction.messageId] || [];

                // 현재 반응이 이미 존재하는지 확인
                const existingReactionIndex = messageReactions.findIndex(
                  (r) =>
                    r.reactionType === reaction.reactionType &&
                    r.userId === reaction.userId
                );

                let updatedReactions;

                if (reaction.actionType === "plus") {
                  // 반응이 없으면 추가
                  if (existingReactionIndex === -1) {
                    updatedReactions = [
                      ...messageReactions,
                      {
                        reactionId: reaction.id || Date.now(), // ID 생성
                        reactionType: reaction.reactionType,
                        userId: reaction.userId,
                        displayName: reaction.displayName,
                        userName: reaction.userName,
                        userImg: reaction.userImg,
                      },
                    ];
                  } else {
                    updatedReactions = [...messageReactions];
                  }
                } else if (
                  reaction.actionType === "minus" &&
                  existingReactionIndex !== -1
                ) {
                  // 반응이 있으면 제거
                  updatedReactions = messageReactions.filter(
                    (r, idx) => idx !== existingReactionIndex
                  );
                } else {
                  updatedReactions = [...messageReactions];
                }

                return {
                  ...prevReactions,
                  [reaction.messageId]: updatedReactions as ReactionVM[], // ReactionVM[] 타입으로 지정
                };
              });
            },
          },
        ],
      });
    }
    return () => clientRef.current?.close();
  }, [roomId, token, userInfo]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }
  };
  const sendReaction = (
    messageId: number,
    reactionType: string,
    actionType = "plus"
  ) => {
    const reactionData = {
      id: null,
      messageId: messageId,
      userId: userInfo?.id,
      reactionType: reactionType,
      roomId: roomId,
      actionType: actionType,
      displayName: userInfo?.displayName,
      userName: userInfo?.userName,
      userImg: userInfo?.avatarUrl,
    };
    const channelMetadata = createMetadata(
      `api.v1.reactions.stream/${roomId}`,
      token!
    );

    // 비활성화 키 설정 업데이트
    setDisabledKeysMap((prevMap) => {
      const updatedMap = new Map(prevMap);
      const disabledKeys = updatedMap.get(messageId) || new Set();

      if (actionType === "plus") {
        disabledKeys.add(reactionType);
      } else if (actionType === "minus") {
        disabledKeys.delete(reactionType);
      }
      updatedMap.set(messageId, disabledKeys);
      return updatedMap;
    });
    if (reactionData.userId) {
      RSocketClientSetup.sendMessage(
        sourceRefForReaction,
        reactionData,
        channelMetadata
      );
    }
    // RSocket 전송
  };

  const handleSendMessage = async () => {
    const content = message;
    const mediaFile = fileInputRef.current?.files?.[0];

    if (content || mediaFile) {
      const sent = moment().toISOString();
      const replyToMessageId = replyTo?.id?.toString() || null;
      const replyContent = replyTo?.content?.toString() || undefined;
      const contentType = mediaFile
        ? mediaFile.type.startsWith("image")
          ? "IMAGE"
          : "VIDEO"
        : "PLAIN";
      const userMessage: Message = {
        content: content,
        user,
        sent,
        roomId: parseInt(roomId),
        replyToMessageId,
        contentType,
        replyContent,
        mediaUrl: mediaFile ? URL.createObjectURL(mediaFile) : undefined, // 미리보기 URL
      };
      if (mediaFile) {
        const formData = new FormData();
        formData.append("file", mediaFile);

        try {
          const response = await apiClient.post("/files/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          // 업로드한 파일의 URL 받기
          const fileUrl = response.data; // 서버에서 반환한 URL
          console.log(fileUrl);
          userMessage.mediaUrl = fileUrl; // 메시지에 URL 포함

          setMediaPreview(null); // 미리보기 초기화
          fileInputRef.current!.value = ""; // 파일 입력 초기화

          console.error("파일 업로드 정상:");
          // mediaFile이 있든 없든 메시지를 전송하도록 조건 수정
          const channelMetadata = createMetadata(
            `api.v1.messages.stream/${roomId}`,
            token!
          );
          RSocketClientSetup.sendMessage(
            sourceRef,
            userMessage,
            channelMetadata
          );
        } catch (error) {
          console.error("파일 업로드 에러:", error);
        }
      } else {
        // mediaFile이 있든 없든 메시지를 전송하도록 조건 수정
        const channelMetadata = createMetadata(
          `api.v1.messages.stream/${roomId}`,
          token!
        );
        RSocketClientSetup.sendMessage(sourceRef, userMessage, channelMetadata);
      }

      // UI 업데이트 후 파일 초기화 및 상태 초기화

      setReplyTo(null); // 답장 초기화
      setMessage("");
    }
  };

  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      setMediaPreview(URL.createObjectURL(file)); // 미리보기 설정
      setMediaType(file.type.startsWith("image") ? "image" : "video"); // 파일 유형 설정
    }
  };

  const handleCancelPreview = () => {
    setMediaPreview(null); // 미리보기 초기화
    setMediaType(null); // 미디어 유형 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // 파일 입력 초기화
    }
  };

  useEffect(() => {
    if (data) {
      const fetchedMessages = data.pages.flatMap((page) => page.content);

      const newDisabledKeysMap = new Map<number, Set<string>>();

      const newReactions = fetchedMessages.reduce(
        (acc: Record<number, ReactionVM[]>, message) => {
          acc[message.id] = message.reactions;

          // 각 메시지에 대해 비활성화할 리액션 타입 추출
          const userReactions = message.reactions
            .filter((reaction: ReactionVM) => reaction.userId == userInfo?.id)
            .map((reaction: ReactionVM) => reaction.reactionType);

          newDisabledKeysMap.set(message.id, new Set(userReactions));

          return acc;
        },
        {}
      );

      setReactions((prevReactions) => ({
        ...prevReactions,
        ...newReactions,
      }));
      setDisabledKeysMap(newDisabledKeysMap); // 상태로 저장하여 이후 렌더링에 반영
    }
  }, [data]);
  useEffect(() => {
    if (chatContainerRef.current && isAtBottom) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      setShowNewMessageAlert(false);
    }
  }, [isAtBottom, messages]);

  useEffect(() => {
    if (isInView && hasNextPage) {
      if (chatContainerRef.current) {
        const currentScrollHeight = chatContainerRef.current.scrollHeight;
        chatContainerRef.current.scrollTop = currentScrollHeight * 0.1; // offset을 조정하여 내려가는 위치 설정
      }
      fetchNextPage();
    }
  }, [isInView, hasNextPage, fetchNextPage]);
  // 페이지가 업데이트되거나 스크롤될 때 메시지를 찾고 계속 시도
  useEffect(() => {
    if (targetMessageId.current !== null) {
      const messageElement = messageRefs.current.get(targetMessageId.current);
      if (messageElement) {
        setTimeout(() => {
          messageElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          targetMessageId.current = null; // 스크롤 성공 시 target 초기화
        }, 1000); // 1초 지연 후 스크롤
      } else {
        if (chatContainerRef.current) {
          const currentScrollHeight = chatContainerRef.current.scrollHeight;
          chatContainerRef.current.scrollTop = 0;
        }
        fetchNextPage(); // 페이지에 없
      }
    }
  }, [data, hasNextPage, targetMessageId]);
  const handleRemoveReaction = (messageId: number, reactionType: string) => {
    // 해당 메시지와 반응을 서버에 업데이트
    sendReaction(messageId, reactionType, "minus"); // false로 설정하여 반응 제거 전송

    // 로컬 상태에서 반응 제거
    // setReactions((prevReactions) => {
    //   const messageReactions = prevReactions[messageId];
    //   if (messageReactions && messageReactions[reactionType] > 0) {
    //     const updatedReactions = { ...messageReactions };
    //     updatedReactions[reactionType] -= 1;
    //     if (updatedReactions[reactionType] === 0)
    //       delete updatedReactions[reactionType];
    //     return { ...prevReactions, [messageId]: updatedReactions };
    //   }
    //   return prevReactions;
    // });
  };
  const calculateUnreadCount = (messageSent: string): number => {
    // messageSent와 lastReadTime을 UTC ISO 형식으로 변환하여 비교
    const messageSentDate = moment.utc(messageSent).toISOString(); // ISO 포맷으로 변환

    const unreadCount = Array.from(userLastReadTimes.values()).filter(
      (readTime) => {
        const lastReadDate = moment.utc(readTime.lastReadTime).toISOString(); // ISO 포맷으로 변환
        return moment(lastReadDate).isBefore(messageSentDate); // UTC 시간 비교
      }
    ).length;

    return unreadCount;
  };

  const isDifferentDay = (
    currentMessage: Message,
    previousMessage?: Message
  ) => {
    return previousMessage
      ? moment.utc(currentMessage.sent).format("YYYY-MM-DD") !==
          moment.utc(previousMessage.sent).format("YYYY-MM-DD")
      : true;
  };
  return (
    <div className="flex flex-col h-screen mx-auto bg-white">
      {/* 그룹 아이콘 및 참여자 드롭다운 */}
      <div className="flex items-center p-4 border-b border-gray-300 bg-gray-100">
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
          {filteredParticipants.length == 1
            ? filteredParticipants[0]?.displayName
            : `${filteredParticipants[0]?.displayName} 외 ${
                filteredParticipants.length - 1
              }명`}
        </div>
      </div>

      <ScrollShadow
        ref={chatContainerRef}
        onScroll={handleScroll}
        offset={100}
        className="flex-1 overflow-y-auto overflow-x-hidden"
      >
        <div className="p-4 space-y-4">
          <div ref={loadMoreRef}>
            {status === "pending" && <p>Loading messages...</p>}
            {infiniteError && (
              <p>Error loading messages: {infiniteError.message}</p>
            )}
          </div>

          {messages.map((message, index) => {
            const showDateHeader = isDifferentDay(message, messages[index - 1]);

            return (
              <div key={index} className="space-y-2">
                {showDateHeader && (
                  <div className="text-center text-xs text-gray-500 py-2">
                    {moment.utc(message.sent).format("MMMM D, YYYY")}
                  </div>
                )}

                <div
                  ref={(el) => {
                    if (el) {
                      messageRefs.current.set(message.id!, el);
                    }
                  }}
                  className={`flex items-start space-x-2 ${
                    message.user.id == user.id ? "justify-end" : ""
                  }`}
                >
                  {message.user.id != user.id && (
                    <Link
                      href={`/channel/${message.user.id}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full overflow-hidden bg-white"
                    >
                      <Avatar
                        size={32}
                        src={message.user.avatarImageLink || ""}
                        alt={message.user.name || ""}
                      />
                    </Link>
                  )}
                  <div className="relative max-w-xs p-2 rounded-lg">
                    <div
                      className={`${
                        message.user.id == user.id
                          ? "bg-sky-100 text-black shadow-md"
                          : "bg-white text-black shadow-md"
                      }`}
                      style={{
                        borderRadius: "15px",
                        padding: "8px 12px",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        wordBreak: "break-word", // 긴 단어를 줄바꿈
                      }}
                    >
                      {/* 더보기 및 반응 선택 버튼 */}
                      <div
                        className={`absolute top-1/2 flex items-center -translate-y-1/2 ${
                          message.user.id == user.id
                            ? "left-1  -translate-x-[90px]"
                            : "right-1 flex-row-reverse  translate-x-[90px]"
                        }`}
                        style={{ top: "50%" }} // 중앙 정렬을 위한 위치 설정
                      >
                        {/* 더보기 메뉴 */}
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              variant="light"
                              isIconOnly
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <EllipsisHorizontalIcon className="h-5 w-5" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Message Actions">
                            <DropdownItem
                              key="reply"
                              onClick={() => setReplyTo(message)}
                            >
                              답글
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>

                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              variant="light"
                              isIconOnly
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <FaceSmileIcon className="h-6 w-6" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Reactions"
                            disabledKeys={
                              disabledKeysMap.get(message.id!) || new Set()
                            }
                          >
                            <DropdownItem
                              key="👍"
                              onClick={() => sendReaction(message.id!, "👍")}
                            >
                              👍 좋아요
                            </DropdownItem>
                            <DropdownItem
                              key="❤️"
                              isDisabled={reactions[message.id!]?.some(
                                (reaction) =>
                                  reaction.userId === userInfo?.id &&
                                  reaction.reactionType === "❤️"
                              )}
                              onClick={() => sendReaction(message.id!, "❤️")}
                            >
                              ❤️ 하트
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                        {/* 안 읽음 카운트 */}
                        {calculateUnreadCount(message.sent) > 0 && (
                          <p
                            className="text-xs mt-1 text-yellow-500"
                            style={{
                              alignSelf: "flex-end",
                              marginLeft:
                                message.user.id == user.id ? "0" : "8px",
                              marginRight:
                                message.user.id == user.id ? "8px" : "0",
                            }}
                          >
                            {calculateUnreadCount(message.sent)}
                          </p>
                        )}
                      </div>
                      {message.replyToMessageId && (
                        <p
                          className="text-xs text-gray-500 cursor-pointer break-words whitespace-pre-line"
                          onClick={() =>
                            scrollToMessage(parseInt(message.replyToMessageId!))
                          }
                        >
                          Replying to: {message.replyContent}
                        </p>
                      )}
                      <p className="font-semibold">
                        {message.user.name}
                        <span className="text-xs text-gray-500">
                          @{message.user.userName}
                        </span>{" "}
                        <span className="text-xs text-gray-500">
                          {moment.utc(message.sent).format("HH:mm:ss")}
                        </span>
                      </p>
                      {message.contentType === "VIDEO" && message.mediaUrl ? (
                        <video
                          src={message.mediaUrl}
                          controls
                          className="rounded-lg max-w-full"
                          crossOrigin="anonymous"
                        />
                      ) : message.contentType === "IMAGE" &&
                        message.mediaUrl ? (
                        <Image
                          src={message.mediaUrl}
                          alt="media content"
                          width={800}
                          height={600}
                          className="rounded-lg max-w-full"
                        />
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>

                    {/* 반응 아이콘 및 개수 (메시지 말풍선 아래쪽) */}
                    <div className="reactions flex space-x-2 mt-1 ml-2">
                      {reactions[message.id!]?.length > 0 &&
                        Array.from(
                          new Set(
                            reactions[message.id!].map(
                              (reaction) => reaction.reactionType
                            )
                          )
                        ).map((reactionType, idx) => (
                          <Dropdown key={idx} className="relative">
                            <DropdownTrigger>
                              <div className="reaction flex items-center space-x-1 cursor-pointer">
                                <span>{reactionType}</span>
                                <span className="text-xs text-gray-500">
                                  {
                                    reactions[message.id!].filter(
                                      (r) => r.reactionType === reactionType
                                    ).length
                                  }
                                </span>
                              </div>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Reaction List">
                              {reactions[message.id!]
                                .filter((r) => r.reactionType === reactionType)
                                .map((r) => (
                                  <DropdownItem
                                    key={r.reactionId}
                                    variant="light"
                                    // className="pointer-events-none"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      {/* <span>
                                        {r.displayName}@{r.userName}
                                      </span> */}
                                      <Account
                                        onClick={() =>
                                          router.push(`/channel/${r.userId}`)
                                        }
                                        userName={r.userName}
                                        avatarUrl={r.userImg}
                                        displayName={r.displayName}
                                      ></Account>
                                      {r.userId == userInfo?.id && (
                                        <Button
                                          variant="bordered"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveReaction(
                                              message.id!,
                                              reactionType
                                            );
                                          }}
                                          className="text-red-500 cursor-pointer ml-2 pointer-events-auto"
                                        >
                                          실행 취소
                                        </Button>
                                      )}
                                    </div>
                                  </DropdownItem>
                                ))}
                            </DropdownMenu>
                          </Dropdown>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollShadow>

      {showNewMessageAlert && (
        <Chip
          color="primary"
          onClick={() => {
            if (chatContainerRef.current) {
              chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
            }
            setShowNewMessageAlert(false);
          }}
        >
          New message
        </Chip>
      )}

      <div
        className="p-4 border-t space-y-2 flex flex-col 
             sm:relative sm:p-4 
             fixed bottom-0 left-0 w-full bg-white z-10"
      >
        {/* 답장 영역 */}
        {replyTo && (
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg text-xs text-gray-500">
            <span>Replying to: {replyTo.content}</span>
            <button
              onClick={() => setReplyTo(null)}
              className="text-blue-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        )}

        {/* 미디어 파일 미리보기 */}
        {mediaPreview && (
          <div className="relative p-2 border rounded-lg bg-gray-100">
            {mediaType === "video" ? (
              <video
                src={mediaPreview}
                className="rounded-lg w-full max-h-40 object-contain"
                controls
              />
            ) : (
              <img
                src={mediaPreview}
                alt="미디어 미리보기"
                className="rounded-lg w-full max-h-40 object-contain"
              />
            )}
            <button
              onClick={handleCancelPreview}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        )}
        {/* 입력 영역 */}
        <div className="flex items-center gap-2">
          {/* 파일 선택 버튼 */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*, video/*"
          />
          <Button
            isIconOnly
            onClick={() => fileInputRef.current?.click()}
            variant="light"
            className="w-10 h-10 rounded-md flex items-center justify-center"
          >
            <PhotoIcon className="h-5 w-5 text-gray-500" />
          </Button>

          {/* 텍스트 입력창 */}
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
            placeholder="메시지 입력"
            minRows={1}
          />

          {/* 메시지 전송 버튼 */}
          <Button
            className="w-10 h-10  flex items-center justify-center bg-blue-500 text-white rounded-lg"
            isIconOnly
            onClick={handleSendMessage}
          >
            <ArrowUpIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
