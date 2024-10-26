// components/MessageInput.tsx
import { Button } from "@nextui-org/button";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { Textarea } from "@nextui-org/input";
import React, { useRef } from "react";

export default function MessageInput({ onSend }) {
  const messageInputRef = useRef<any>(null);

  const handleSendMessage = () => {
    const content = messageInputRef.current.value;
    onSend(content);
    messageInputRef.current.value = "";
  };

  return (
    <div className="p-4 border-t flex">
      <Textarea className="flex-1" placeholder="메시지 입력" ref={messageInputRef} />
      <Button className="w-8 h-8" type="submit" isIconOnly onClick={handleSendMessage}>
        <ArrowUpIcon className="h-4 w-4" />
        <span className="sr-only">Send</span>
      </Button>
    </div>
  );
}
