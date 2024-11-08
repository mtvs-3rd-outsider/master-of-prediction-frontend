"use client";

import apiClient from "@handler/fetch/axios";
import { useCallback, useEffect, useState } from "react";
import UserAccount from "./UserAccount";
import { Input } from "@nextui-org/input";

interface FeedUserType {
  userID: number;
  userName: string;
  displayName: string;
  tierName: string;
  userImg: string;
}

interface FeedCommentContentType {
  content: string;
  imageUrl: string;
}

interface FeedWriterType{
    writerNo: number;
    writerName: string;
    isLoginUser: boolean;
}

interface FeedCommentType {
  channelId: number;
  writerNo: FeedWriterType;
  id: number;
  content: FeedCommentContentType;
}

interface FeedCommentsType {
  comment: FeedCommentType;
  user: FeedUserType;
}

interface FeedCommentsProps {
  id: string;
  onCommentAdd?: () => void;
}

const FeedComments: React.FC<FeedCommentsProps> = ({ id, onCommentAdd }) => {
  const [comments, setComments] = useState<FeedCommentsType[]>([]);
  const [inputState, setInputState] = useState<string>("");

  const loadComments = useCallback(async () => {
    if (id && id !== 'undefined') {
      try {
        const res = await apiClient.get(`/feed-products/comments?feedId=${id}`);
        setComments(res.data);
      } catch (error) {
        console.error("댓글을 불러오는 데 실패했습니다:", error);
      }
    }
  }, [id]);

  useEffect(() => {
    loadComments();
  }, [id, loadComments]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputState(e.target.value);
  };

  const handleClick = async () => {
    if (id && id !== 'undefined') {
      try {
        await apiClient.post("/category-channels/comment", {
          channelId: id,
          comment: inputState,
        });
        loadComments();
        setInputState("");
        if (onCommentAdd) {
          onCommentAdd();  // 댓글이 추가되면 부모 컴포넌트에 알림
        }
      } catch (error) {
        console.error("댓글 작성에 실패했습니다:", error);
      }
    } else {
      console.error("유효하지 않은 feedId");
    }
  };
  return (
    <>
      <Input
        className="flex py-8"
        type="text"
        value={inputState}
        onChange={handleChange}
        placeholder="댓글을 입력하세요..."
        endContent={
          <div className="flex items-center whitespace-nowrap ml-2">
            <button 
              onClick={handleClick} 
              className="text-blue-700 hover:text-blue-800 cursor-pointer px-2"
            >
              게시
            </button>
            </div>
   }
   />
      <ul>
        {comments.map((commentItem, idx) => (
          <li key={idx} className="flex px-4 py-4 shadow">
            <UserAccount
              displayName={commentItem.user.displayName}
              userName={commentItem.user.userName}
              tier={commentItem.user.tierName}
              avatarUrl={commentItem.user.userImg}
            />
    <p className="pl-4 flex items-center flex-1">
                  {commentItem.comment.content.content}
                </p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default FeedComments;