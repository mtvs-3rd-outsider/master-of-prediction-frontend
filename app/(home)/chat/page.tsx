"use client";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { RSocketClient, BufferEncoders, encodeAndAddWellKnownMetadata, MESSAGE_RSOCKET_ROUTING, MESSAGE_RSOCKET_COMPOSITE_METADATA } from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";
import { Flowable } from "rsocket-flowable";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { Avatar } from "@nextui-org/avatar";
import sanitizeHtml from "sanitize-html";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const ChatPage = () => {
  const [user, setUser] = useState<User>({ name: "", avatarImageLink: "" });
  
  type Message = {
    content: string;
    user: User;
    sent: string; // ISO 포맷의 날짜 문자열
    roomId: number;
  };

  type User = {
    name: string;
    avatarImageLink: string;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoom] = useState<any>(2);
  const [endpoint, setEndpoint] = useState<any>(null);
  const chatAreaRef = useRef<any>(null);
  const messageInputRef = useRef<any>(null);
  const clientRef = useRef<any>(null);
  const sourceRef = useRef<any>(null);

  useEffect(() => {
    // 랜덤 사용자 데이터 가져오기
    fetch("https://randomuser.me/api/")
      .then((response) => response.json())
      .then((data) => {
        setUser({
          name: `${data.results[0].name.first} ${data.results[0].name.last}`,
          avatarImageLink: data.results[0].picture.large,
        });
      });

    // RSocket 클라이언트 초기화
    const client = new RSocketClient({
      transport: new RSocketWebSocketClient(
        {
          url: process.env.NEXT_PUBLIC_RSOCKET_URL!,
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
      setRoom(2);
      setEndpoint(`api.v1.messages.stream/${roomId}`);

      // requestChannel 설정 - 채팅방 연결 후 스트림 유지
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
    });

    // 컴포넌트 언마운트 시 클린업
    return () => {
      if (clientRef.current) {
        clientRef.current.close();
      }
    };
  }, [roomId, endpoint]);

  const handleSendMessage = () => {
    const content = messageInputRef.current.value;

    if (content && sourceRef.current) {
      messageInputRef.current.value = "";
      sourceRef.current.onNext({
        data: Buffer.from(
          JSON.stringify({
            content: content,
            user: user,
            sent: new Date().toISOString(),
            roomId: roomId, // roomId를 메시지에 포함
          })
        ),
        metadata: encodeAndAddWellKnownMetadata(
          Buffer.alloc(0),
          MESSAGE_RSOCKET_ROUTING,
          Buffer.from(String.fromCharCode(endpoint.length) + endpoint)
        ),
      });
    }
  };

  return (
    <>
      <div className="flex-1 overflow-auto p-4 w-full" ref={chatAreaRef}>
        <ul className="space-y-4">
          {messages.map((msg, index) => {
            // HTML 필터링 대신 마크다운을 사용
            return (
              <li key={index} className="flex space-x-4">
                <Avatar src={msg.user.avatarImageLink} size="md" />
                <div className="flex-1">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    {/* 마크다운 콘텐츠 렌더링 */}
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
    {msg.content}
  </ReactMarkdown>
                    <small className="text-gray-500">
                      {msg.user.name} | {moment(msg.sent).format("DD-MM-YYYY, HH:mm:ss")}
                    </small>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-4 flex items-center border-t border-gray-300">
        <Textarea
          ref={messageInputRef}
          placeholder="메시지를 입력하세요"
          rows={2}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} className="ml-4 bg-blue-500 text-white">
          보내기
        </Button>
      </div>
    </>
  );
};

export default ChatPage;
