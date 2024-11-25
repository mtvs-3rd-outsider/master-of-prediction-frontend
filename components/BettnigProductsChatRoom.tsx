"use client"
import { useState, useRef, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { Chip } from "@nextui-org/chip";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import Avatar from "./radix/Avatar";
import { Flowable } from "rsocket-flowable";
import moment from "moment";
import { RSocketClient, BufferEncoders, encodeAndAddWellKnownMetadata, MESSAGE_RSOCKET_ROUTING, MESSAGE_RSOCKET_COMPOSITE_METADATA } from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";
import { Textarea } from "@nextui-org/input";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useUserStore from "@store/useUserStore";
import { RSocketClientSetup } from "@/hooks/useRSocketConnection";
import { createMetadata } from "@util/metadataUtils";
import { Message, User } from "./ChatUI";
import { toUser } from "@util/Converter";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchDMs } from "@handler/DM";
import { useInView } from "react-intersection-observer";
import { isDifferentDay } from "@util/Date";
import Link from "next/link";



export default function ChatUI({ id }: any) {
  console.log(id);
  const messageInputRef = useRef<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [roomId, setRoom] = useState<any>("bet-" + id);
  const [endpoint, setEndpoint] = useState<any>(null);
    const userInfo = useUserStore((state) => state.userInfo);
    const token = useUserStore((state) => state.userInfo?.token);
    const hasHydrated = useUserStore((state) => state.hasHydrated);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    rootMargin: "100px",
    threshold: 0.5,
    triggerOnce: false,
    root: chatContainerRef.current,
  });
  // RSocket 관련 상태 및 변수
  const clientRef = useRef<any>(null);
  const sourceRef = useRef<any>(null);
  const [user, setUser] = useState<User>(); // User 상태로 초기화

  useEffect(() => {
    // hydration이 완료된 후에만 로그인 상태 확인
    if (hasHydrated && !userInfo) {
    } else {
      const convertedUser = toUser(userInfo);
      if (convertedUser) setUser(convertedUser);
    }
  }, [hasHydrated, userInfo]);
  // RSocket 초기화
   useEffect(() => {
     if (!userInfo) {
       console.warn("UserInfo is not available. Skipping RSocket setup.");
       return;
     }

     const setupRSocket = async () => {
       try {
         console.log("Initializing RSocket connection...");

         // RSocket 클라이언트 초기화
         const rsocket = await RSocketClientSetup.init({
           token,
           channels: [
             {
               sourceRef: sourceRef,
               onNext: (x) => console.log("Channel data:", x),
             },
           ],
           streams: [
             {
               endpoint: `api.v1.messages.stream/${roomId}`,
               onNext: (message: Message) => {
                 console.log("Received message:", message);
                 setMessages((prev) => [...prev, message]);
                 if (!isAtBottom) setShowNewMessageAlert(() => true);
               },
             },
           ],
         });

         clientRef.current = rsocket; // RSocket 객체 저장
         console.log("RSocket connection established");
       } catch (error) {
         console.error("Failed to establish RSocket connection:", error);
       }
     };

     // RSocket 설정
     if (clientRef.current == null) {
       setupRSocket();
     }

     // Cleanup: RSocket 연결 종료
     return () => {
       console.log("Unmounting component. Closing RSocket connection...");
       if (clientRef.current) {
         clientRef.current.close(); // 연결 종료
         clientRef.current = null; // 초기화
       }
     };
   }, [
     userInfo,
     roomId,
     token,
     sourceRef,
   ]);


  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setIsAtBottom(isBottom);

      if (isBottom) {
        setShowNewMessageAlert(false);
      }
    }
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
    queryFn: ({ pageParam = 1 }) => fetchDMs(pageParam, roomId),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      !lastPage.last ? lastPage.number + 1 : undefined,
    enabled: !!userInfo,
  });
  useEffect(() => {
    if (isInView && hasNextPage) {
      if (chatContainerRef.current) {
        const currentScrollHeight = chatContainerRef.current.scrollHeight;
        chatContainerRef.current.scrollTop = currentScrollHeight * 0.1; // offset을 조정하여 내려가는 위치 설정
      }
      fetchNextPage();
    }
  }, [isInView, hasNextPage, fetchNextPage]);
  // 메시지 ref 맵을 저장하는 객체
  const messageRefs = useRef(new Map<number, HTMLDivElement>());
  // 페이지가 업데이트되거나 스크롤될 때 메시지를 찾고 계속 시도
  const targetMessageId = useRef<number | null>(null); // 이동할 메시지 ID
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
  useEffect(() => {
    if (data) {
      const fetchedMessages = data.pages.flatMap((page) => page.content);
      setMessages((prev) => [...fetchedMessages.reverse(), ...prev]);
    }
  }, [data]);
  // 메시지 전송 처리
  const handleSendMessage = () => {
    if (!user) {
      return;
    }

    const content = messageInputRef.current.value;
    const replyToMessageId = null;
    const replyContent = undefined;
    const sent = moment().toISOString();
    messageInputRef.current.value = "";
    const userMessage: Message = {
      content: content,
      user,
      sent,
      roomId: roomId,
      contentType: "PLAIN",
    };

    // 메시지를 RSocket으로 전송
    if (content && sourceRef.current) {
      const channelMetadata = createMetadata(
        `api.v1.messages.stream.betting/${roomId}`,
        token!
      );
      RSocketClientSetup.sendMessage(sourceRef, userMessage, channelMetadata);
    }
  };

  // 새 메시지가 추가될 때 자동 스크롤
  useEffect(() => {
    if (chatContainerRef.current && isAtBottom) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    } else if (!isAtBottom) {
      setShowNewMessageAlert(true); // 스크롤이 맨 아래가 아닌 경우 알림 표시
    }
  }, [isAtBottom, messages]);
  if (!user) {
    return null;
  }
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto w-full bg-white m-4">
      <ScrollShadow
        ref={chatContainerRef}
        onScroll={handleScroll}
        hideScrollBar
        offset={100}
        orientation="horizontal"
        className="w-auto h-auto  flex-1 overflow-y-auto"
      >
        <div className="p-4 space-y-4 ">
          <div ref={loadMoreRef}>
            {status === "pending" && <p>Loading messages...</p>}
            {infiniteError && (
              <p>Error loading messages: {infiniteError.message}</p>
            )}
          </div>

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
                {/* {message.user.id != user.id && (
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
                )} */}
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
                   
                    </div>
                    
                    <p className="font-semibold">
                      {message.user.name}
                      <span className="text-xs text-gray-500">
                        @{message.user.userName}
                      </span>{" "}
                      <span className="text-xs text-gray-500">
                        {moment.utc(message.sent).format("HH:mm:ss")}
                      </span>
                    </p>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollShadow>

      {/* New message alert */}
      {showNewMessageAlert && (
        <div className="px-4 pb-2">
          <Chip
            color="primary"
            onClick={() => {
              if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop =
                  chatContainerRef.current.scrollHeight;
                setShowNewMessageAlert(false);
              }
            }}
          >
            New message
          </Chip>
        </div>
      )}

      <div className="p-4 border-t flex">
        <Textarea
          className="flex-1"
          placeholder="메시지 입력"
          ref={messageInputRef}
        />
        <Button
          className="w-8 h-8"
          type="submit"
          isIconOnly
          onClick={handleSendMessage}
        >
          <ArrowUpIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}
