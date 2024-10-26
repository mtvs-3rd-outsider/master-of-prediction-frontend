"use client"
import { useState, useRef, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { Chip } from "@nextui-org/chip";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import useUserStore from "@store/useUserStore";
import { RSocketClientSetup } from "@/hooks/useRSocketConnection";
import { createMetadata } from "@util/metadataUtils";
import MessageList from "./MessageList";
import { toUser } from "@util/Converter";

type User = { name?: string; avatarImageLink?: string; id: string | undefined; };
type Message = {
  content: string;
  user: User;
  sent: string;
  roomId: number;
  replyToMessageId: number | null;
  contentType: string;
};
interface ChatUIProps { receiverId: string; senderId: string; }

export default function ChatUI({ receiverId, senderId }: ChatUIProps) {
  const sortedIds = [parseInt(senderId), parseInt(receiverId)].sort((a, b) => a - b);
  // const [roomId] = useState(`DM-${sortedIds[0]}-${sortedIds[1]}`);
  const [roomId] = useState(`2`);
  const { userInfo, token } = useUserStore(state => ({ userInfo: state.userInfo, token: state.userInfo?.token }));
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);
  const messageInputRef = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<any>(null);
  const sourceRef = useRef<any>(null);
  const user: User = toUser(userInfo!);
  // useDMThreadStatus(Number(senderId), Number(receiverId));

  useEffect(() => {
    if(userInfo)
    {
      RSocketClientSetup.init(clientRef, sourceRef, roomId, token!,userInfo.id!.toString(), (message) => setMessages((prev) => [...prev, message]));
    }
    return () => clientRef.current?.close();
  }, [roomId, token,userInfo]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }
  };

  const handleSendMessage = async () => {
    const content = messageInputRef.current?.value;
    if (content) {
      messageInputRef.current.value = "";
      const channelMetadata = createMetadata(`api.v1.messages.stream/${roomId}`, token!);
      RSocketClientSetup.sendMessage(sourceRef, content, channelMetadata, user, roomId);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current && isAtBottom) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    } else if (!isAtBottom) {
      setShowNewMessageAlert(true);
    }
  }, [isAtBottom, messages]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white">
      <ScrollShadow ref={chatContainerRef} onScroll={handleScroll} hideScrollBar offset={100} className="flex-1 overflow-y-auto">
        <MessageList messages={messages} user={user} />
      </ScrollShadow>

      {showNewMessageAlert && (
        <Chip color="primary" onClick={() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
          setShowNewMessageAlert(false);
        }}>New message</Chip>
      )}

      <div className="p-4 border-t flex">
        <Textarea ref={messageInputRef} className="flex-1" placeholder="메시지 입력" />
        <Button className="w-8 h-8" isIconOnly onClick={handleSendMessage}>
          <ArrowUpIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
