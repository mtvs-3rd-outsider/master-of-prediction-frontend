import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import moment from "moment";
import Avatar from "./radix/Avatar";
import { useInView } from "react-intersection-observer";

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
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  status: string;
  error: Error | null;
  fetchNextPage: () => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  user, 
  hasNextPage, 
  isFetchingNextPage, 
  status, 
  error, 
  fetchNextPage 
}) => {
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // 무한 스크롤 로직
  useEffect(() => {
    if (isInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  let lastDisplayedDate: string | null = null;

  return (
    <div className="p-4 space-y-4">
      {status === "loading" && <p>Loading messages...</p>}
      {error && <p>Error loading messages: {error.message}</p>}

      {messages.map((message, index) => {
        const messageDate = moment(message.sent).format("YYYY-MM-DD");
        const isNewDate = messageDate !== lastDisplayedDate;

        if (isNewDate) {
          lastDisplayedDate = messageDate;
        }

        return (
          <div key={index} className="space-y-2">
            {isNewDate && (
              <div className="text-center text-xs text-gray-500 mb-2">
                {moment(message.sent).format("MMMM D, YYYY")}
              </div>
            )}
            <div className={`flex items-start space-x-2 ${message.user.id === user.id ? "justify-end" : ""}`}>
              {message.user.id !== user.id && (
                <Avatar size={32} src={message.user.avatarImageLink || undefined} />
              )}
              <div className={`max-w-xs p-2 ${message.user.id === user.id ? "text-right" : "text-left"}`}>
                <p className="font-semibold">
                  {message.user.name}{" "}
                  <span className="text-xs text-gray-500">
                    {moment(message.sent).format("HH:mm:ss")}
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
          </div>
        );
      })}

      {/* Load More Indicator */}
      <div ref={loadMoreRef}>
        {isFetchingNextPage && <p>Loading more messages...</p>}
        {!hasNextPage && <p></p>}
      </div>
    </div>
  );
};

export default MessageList;
