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
import markMessageAsRead, { updateLastMessage } from "@handler/DM";
import useDMThreadStatus from "@/hooks/useDMThreadStatus";

// 메시지 및 유저 타입 정의
type User = {
  name?: string;
  avatarImageLink?: string;
  id: string | undefined;
};
interface ChatUIProps {

  receiverId: string; // receiverId도 string 또는 number일 수 있음
  senderId:string;
}
type Message = {
  content: string;
  user: User;
  sent: string; // ISO 포맷의 날짜 문자열
  roomId: number;
  replyToMessageId: number |null,
  contentType: string
};

export default function ChatUI({receiverId,senderId} :ChatUIProps ) {

    // senderId와 receiverId를 정렬하여 roomId 생성
    const sortedIds = [parseInt(senderId), parseInt(receiverId)].sort((a, b) => a - b);
    useDMThreadStatus(Number(senderId), Number(receiverId));
  const messageInputRef = useRef<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reactions, setReactions] = useState<Message[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [roomId, setRoom] = useState<any>("DM-"+`${sortedIds[0]}-${sortedIds[1]}`);
  const [endpoint, setEndpoint] = useState<any>(null);
  const [endpointForReaction, setEndpointForReaction] = useState<any>(null);
  const userInfo = useUserStore(state=> state.userInfo);
  // RSocket 관련 상태 및 변수
  const clientRef = useRef<any>(null);
  const sourceRef = useRef<any>(null);
  const user: User = { name: userInfo?.displayName, avatarImageLink: userInfo?.avatarUrl , id: userInfo!.id }; // 현재 사용자를 하드코딩했으나 동적으로 변경 가능

  // RSocket 초기화
  useEffect(() => {
    const client = new RSocketClient({
      transport: new RSocketWebSocketClient(
        {
          url: process.env.NEXT_PUBLIC_RSOCKET_URL!, // RSocket 서버 URL
        },
        BufferEncoders
      ),
      setup: {
        dataMimeType: "application/json",
        metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.toString(),
        keepAlive: 5000,
        lifetime: 60000,
      },
    });

    client.connect().then((rsocket) => {
      clientRef.current = rsocket;
      // setRoom(2);
      setEndpoint(`api.v1.messages.stream/${roomId}`);
      setEndpointForReaction(`api.v1.reactions.stream/${roomId}`)

      // 메시지 수신 스트림 설정
      rsocket
        .requestChannel(
          new Flowable((source) => {
            sourceRef.current = source;
            source.onSubscribe({
              cancel: () => {},
              request: (n) => {},
            });
          })
        )
        .subscribe({
          onComplete: () => {
            console.log("requestChannel onComplete");
          },
          onSubscribe: (subscription) => {
            subscription.request(1000); // 수신할 메시지 수 설정
            console.log("requestChannel onSubscribe");
          },
          onError: (error) => {
            console.log("requestChannel e: ", error);
          },
          onNext: (payload) => {
            console.log("requestChannel onNext: ", payload);
          },
        });

        rsocket
        .requestStream({
          metadata: encodeAndAddWellKnownMetadata(
            Buffer.alloc(0),
            MESSAGE_RSOCKET_ROUTING,
            Buffer.from(String.fromCharCode(endpoint.length) + endpoint)
          ),
        })
        .subscribe({
          onComplete: () => {
            console.log("requestStream onComplete");
          },
          onSubscribe: (subscription) => {
            console.log("requestStream onSubscribe");
            subscription.request(1000); // 수신할 메시지 수 설정
          },
          onNext: (e: any) => {
            try {
              const v = JSON.parse(e.data);
              console.log("requestStream onNext", v);
              setMessages((prevMessages) => [...prevMessages, v]);
            } catch (error) {
              console.error("JSON parsing error: ", error);
            }
          },
          onError: (error) => {
            console.log("requestStream e: ", error);
          },
    });
//     rsocket
//     .requestStream({
//       metadata: encodeAndAddWellKnownMetadata(
//         Buffer.alloc(0),
//         MESSAGE_RSOCKET_ROUTING,
//         Buffer.from(String.fromCharCode(endpointForReaction.length) + endpointForReaction)
//       ),
//     })
//     .subscribe({
//       onComplete: () => {
//         console.log("requestStream onComplete");
//       },
//       onSubscribe: (subscription) => {
//         console.log("requestStream onSubscribe");
//         subscription.request(1000); // 수신할 메시지 수 설정
//       },
//       onNext: (e: any) => {
//         try {
//           const v = JSON.parse(e.data);
//           console.log("requestStream onNext", v);
//           setMessages((prevMessages) => [...prevMessages, v]);
//         } catch (error) {
//           console.error("JSON parsing error: ", error);
//         }
//       },
//       onError: (error) => {
//         console.log("requestStream e: ", error);
//       },
// });
    });

    return () => {
      if (clientRef.current) {
        clientRef.current.close();
      }
    };
  }, [endpoint, roomId]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setIsAtBottom(isBottom);

      if (isBottom) {
        setShowNewMessageAlert(false);
      }
    }
  };

  // 메시지 전송 처리
  const handleSendMessage = async () => {
    const content = messageInputRef.current.value;
    if (content && sourceRef.current) {
      messageInputRef.current.value = "";

    // 메시지를 RSocket으로 전송
    if (content && sourceRef.current) {
      messageInputRef.current.value = "";

      sourceRef.current.onNext({
        data: Buffer.from(
          JSON.stringify({
            content: content,
            user: user,
            sent: new Date().toISOString(),
            roomId: roomId ,// roomId를 메시지에 포함,
            replyToMessageId: null,
            contentType: "PLAIN"
          })
        ),
        metadata: encodeAndAddWellKnownMetadata(
          Buffer.alloc(0),
          MESSAGE_RSOCKET_ROUTING,
          Buffer.from(String.fromCharCode(endpoint.length) + endpoint)
        ),
      });
      await updateLastMessage(Number(senderId), Number(receiverId), content);
    }

  };
}

  // 새 메시지가 추가될 때 자동 스크롤
  useEffect(() => {
    if (chatContainerRef.current && isAtBottom) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      markMessageAsRead(Number(senderId), Number(receiverId)); // 메시지 읽음 처리
    } else if (!isAtBottom) {
      setShowNewMessageAlert(true); // 스크롤이 맨 아래가 아닌 경우 알림 표시
    }
  }, [isAtBottom, messages]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white">
      <ScrollShadow
        ref={chatContainerRef}
        onScroll={handleScroll}
        hideScrollBar
        offset={100}
        orientation="horizontal"
        className="w-auto h-auto  flex-1 overflow-y-auto"
      >
        <div className="p-4 space-y-4">
          {messages.map((message, index) => {
            return (
              <div
                key={index}
                className={`flex items-start space-x-2 ${message.user.id == user.id ? "justify-end" : ""}`}
              >
                <Avatar size={32} src={message.user.avatarImageLink || undefined} />
                <div
                  className={`max-w-xs p-2 ${message.user.id == user.id ? "text-right" : "text-left"}`}
                >
                  <p className="font-semibold">
                    {message.user.name}{" "}
                    <span className="text-xs text-gray-500">
                      {moment(message.sent).format("DD-MM-YYYY, HH:mm:ss")}
                    </span>
                  </p>
                  {/* React Markdown으로 콘텐츠 렌더링 */}
                  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      table: ({ node, ...props }) => (
        <table className="table-auto border-collapse border border-gray-400" {...props} />
      ),
      th: ({ node, ...props }) => (
        <th className="border border-gray-300 px-4 py-2" {...props} />
      ),
      td: ({ node, ...props }) => (
        <td className="border border-gray-300 px-4 py-2" {...props} />
      ),
    }}
  >
    {message.content}
  </ReactMarkdown>
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
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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
        <Button className="w-8 h-8" type="submit" isIconOnly onClick={handleSendMessage}>
          <ArrowUpIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}