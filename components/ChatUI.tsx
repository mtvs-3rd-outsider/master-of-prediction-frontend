"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { ArrowUpIcon, PhotoIcon } from "@heroicons/react/24/solid";
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

type User = { name?: string; avatarImageLink?: string; id: string | undefined };
export type Message = {
  content: string;
  user: User;
  sent: string;
  roomId: number;
  replyToMessageId: string | null;
  contentType: string;
  mediaUrl?: string;
  mediaType?: string | null; // mediaType 필드 추가
  id?: number | null;
};

interface ChatUIProps {
  roomId: string;
}

export default function ChatUI({ roomId }: ChatUIProps) {
  const clientRef = useRef<any>(null);
  const { userInfo, token } = useUserStore((state) => ({
    userInfo: state.userInfo,
    token: state.userInfo?.token,
  }));
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null); // 미디어 유형 상태 추가
  const messageInputRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const sourceRef = useRef<any>(null);
  const user: User = toUser(userInfo);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    rootMargin: "100px",
    threshold: 0.5,
    triggerOnce: false,
  });
   // 메시지 ref 맵을 저장하는 객체
   const messageRefs = useRef(new Map<number, HTMLDivElement>());
   const scrollToMessage = (messageId: number) => {
    const messageElement = messageRefs.current.get(messageId);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
console.log(messages)
  const fetchDMs = async (pageParam: number) => {
    const response = await apiClient.get(`/messages/room/${roomId}`, {
      params: { page: pageParam, size: 5 },
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

  useEffect(() => {
    if (userInfo) {
      RSocketClientSetup.init({
        clientRef,
        token,
        channels: [{ sourceRef: sourceRef, onNext: (x) => x }],
        streams: [
          {
            endpoint: `api.v1.messages.stream/${roomId}`,
            onNext: (message: Message) => {
              setMessages((prev) => [...prev, message]);
              if (!!isAtBottom) setShowNewMessageAlert(() => true);
            },
          },
          {
            endpoint: `api.v1.messages.connect/${roomId}`,
            onNext: (data) => data,
          },
        ],
      });
    }
    return () => clientRef.current?.close();
  }, [roomId, token, userInfo]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }
  };

  const handleSendMessage = async () => {
    const content = messageInputRef.current?.value;
    const mediaFile = fileInputRef.current?.files?.[0];

    if (content || mediaFile) {
      messageInputRef.current.value = "";

      const sent = moment().toISOString();
      const replyToMessageId = replyTo?.id?.toString() || null;
      const userMessage = {
        content: mediaFile ? "" : content,
        user,
        sent,
        roomId: parseInt(roomId),
        replyToMessageId,
        contentType: mediaFile ? "media" : "PLAIN",
      };

      if (mediaFile) {
        setMessages((prev) => [...prev, userMessage]);
        setMediaPreview(null);
        setMediaType(null);
        // fileInputRef?.current.value = ""; // 파일 입력 초기화
      } else {
        const channelMetadata = createMetadata(
          `api.v1.messages.stream/${roomId}`,
          token!
        );
        RSocketClientSetup.sendMessage(sourceRef, userMessage, channelMetadata);
      }

      setReplyTo(null); // 답장 초기화
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
    if (chatContainerRef.current && isAtBottom) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      setShowNewMessageAlert(false);
    }
  }, [isAtBottom, messages]);

  useEffect(() => {
    if (isInView && hasNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, fetchNextPage]);

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
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white">
      <ScrollShadow
        ref={chatContainerRef}
        onScroll={handleScroll}
        offset={100}
        className="flex-1 overflow-y-auto"
      >
        <div className="p-4 space-y-4">
          <div ref={loadMoreRef}>
            {isFetchingNextPage && <p>Loading more messages...</p>}
            {!hasNextPage && <p>No more messages</p>}
          </div>

          {status === "pending" && <p>Loading messages...</p>}
          {infiniteError && (
            <p>Error loading messages: {infiniteError.message}</p>
          )}

          {messages.map((message, index) => {
            const showDateHeader = isDifferentDay(
              message,
              messages[index - 1]
            );

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
                  <div
                    className={`max-w-xs p-2 rounded-lg ${
                      message.user.id == user.id
                        ? "bg-sky-100 text-black shadow-md"
                        : "bg-white text-black shadow-md"
                    }`}
                    style={{
                      borderRadius: "15px",
                      padding: "8px 12px",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                    onContextMenu={(event) => {
                      event.preventDefault(); // 기본 컨텍스트 메뉴 방지
                      setReplyTo(message); // 꾹 클릭 시 답장 설정
                      console.log("Reply set for message:", message); // 디버그용 로그
                    }}
                  >
                    {message.replyToMessageId && (
                      <p
                        className="text-xs text-gray-500 cursor-pointer"
                        onClick={() =>
                          scrollToMessage(parseInt(message.replyToMessageId!))
                        }
                      >
                        Replying to:{" "}
                        {
                          messages.find(
                            (msg) => msg.id === parseInt(message.replyToMessageId!)
                          )?.content
                        }
                      </p>
                    )}
                    <p className="font-semibold">
                      {message.user.name}{" "}
                      <span className="text-xs text-gray-500">
                        {moment.utc(message.sent).format("HH:mm:ss")}
                      </span>
                    </p>
                    {message.contentType === "media" && message.mediaUrl ? (
                      message.mediaType === "video" ? (
                        <video
                          src={message.mediaUrl}
                          controls
                          className="rounded-lg max-w-full"
                        />
                      ) : (
                        <img
                          src={message.mediaUrl}
                          alt="media content"
                          className="rounded-lg max-w-full"
                        />
                      )
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    )}
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

      <div className="p-4 border-t space-y-2 flex flex-col">
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
                className="rounded-lg w-full max-h-40"
                controls
              />
            ) : (
              <img
                src={mediaPreview}
                alt="미디어 미리보기"
                className="rounded-lg w-full max-h-40"
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
            ref={messageInputRef}
            className="flex-1"
            placeholder="메시지 입력"
            rows={1}
          />

          {/* 메시지 전송 버튼 */}
          <Button
            className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-lg"
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
