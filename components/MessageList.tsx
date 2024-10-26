// MessageList.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import moment from "moment";
import Avatar from "./radix/Avatar";

type User = {
  name?: string;
  avatarImageLink?: string;
  id: string | undefined;
};

type Message = {
  content: string;
  user: User;
  sent: string;
  roomId: number;
  replyToMessageId: number | null;
  contentType: string;
};

interface MessageListProps {
  messages: Message[];
  user: User;
}

const MessageList: React.FC<MessageListProps> = ({ messages, user }) => {
  return (
    <div className="p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-start space-x-2 ${message.user.id == user.id ? "justify-end" : ""}`}
        >
          {message.user.id !== user.id && (
            <Avatar size={32} src={message.user.avatarImageLink || undefined} />
          )}
          <div className={`max-w-xs p-2 ${message.user.id == user.id ? "text-right" : "text-left"}`}>
            <p className="font-semibold">
              {message.user.name}{" "}
              <span className="text-xs text-gray-500">
                {moment(message.sent).format("DD-MM-YYYY, HH:mm:ss")}
              </span>
            </p>
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
      ))}
    </div>
  );
};

export default MessageList;
