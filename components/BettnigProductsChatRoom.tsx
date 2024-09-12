import { useState, useRef, useEffect } from "react";
// import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { Chip } from "@nextui-org/chip";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import Avatar from "./radix/Avatar";
type Message = {
  id: number;
  sender: string;
  text: string;
  time: string;
  avatar?: string;
};

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Tom Martinez",
      text: "Hello!",
      time: "10:31",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 2,
      sender: "Tom Martinez",
      text: "How are you? I just found an excellent chat solution that will fit our needs!",
      time: "10:32",
      avatar: "/placeholder-user.jpg",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true); // 스크롤이 맨 아래에 있는지 여부
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false); // 새 메시지 알림 표시 여부
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // 스크롤 이벤트 처리
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 10; // 스크롤이 맨 아래에 있는지 확인
      setIsAtBottom(isBottom);

      if (isBottom) {
        setShowNewMessageAlert(false); // 스크롤이 맨 아래에 있으면 새 메시지 알림 숨김
      }
    }
  };

  // 새 메시지 추가 시 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newChat: Message = {
      id: messages.length + 1,
      sender: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: "/your-avatar.jpg",
    };

    setMessages([...messages, newChat]);
    setNewMessage(""); // 입력 필드 초기화
  };

  // 메시지가 추가될 때 자동 스크롤
  useEffect(() => {
    if (chatContainerRef.current && isAtBottom) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    } else if (!isAtBottom) {
      setShowNewMessageAlert(true); // 스크롤이 맨 아래가 아닌 경우 알림 표시
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white">
      <ScrollShadow
          ref={chatContainerRef}
          onScroll={handleScroll} // 스크롤 이벤트 바인딩

        hideScrollBar
        offset={100}
        orientation="horizontal"
        className="max-w-[400px] max-h-[300px] flex-1 overflow-y-auto"
      >
        <div
      
          className="p-4 space-y-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.sender === "You" ? "justify-end" : ""
              }`}
            >
              <Avatar size={32}  src={message.avatar || undefined} />
              <div
                className={`max-w-xs p-2 ${
                  message.sender === "You" ? "text-right" : "text-left"
                }`}
              >
                <p className="font-semibold">
                  {message.sender}{" "}
                  <span className="text-xs text-gray-500">{message.time}</span>
                </p>
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollShadow>

      {/* 새 메시지 알림 */}
      {showNewMessageAlert && (
        <div className="px-4 pb-2">
          <Chip color="primary" onClick={() => {
            // 알림 클릭 시 맨 아래로 스크롤
            if (chatContainerRef.current) {
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
              setShowNewMessageAlert(false); // 알림 숨기기
            }
          }}>
            New message
          </Chip>
        </div>
      )}

      <div className="p-4 border-t">
        <form className="flex space-x-2" onSubmit={handleSubmit}>
          <Input
            className="flex-1"
            placeholder="메시지 입력"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" isIconOnly>
            <ArrowUpIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
