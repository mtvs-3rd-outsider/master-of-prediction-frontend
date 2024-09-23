"use client";

import apiClient, { sendMultipartForm } from "@handler/fetch/axios";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import BettingAccount from "./BettingAccount";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";

interface BettingUserType {
  userID: number;
  userName: string;
  displayName: string;
  tierName: string;
  userImg: string;
}

interface BettingWriterType {
  writerNo: number;
}

interface BettingCommentContentType {
  comment: string;
  imageUrl: string;
}

interface BettingCommentType {
  likeCnt: number;
  replyCnt: number;
  bettingChannelId: number;
  createdAt: string;
  deletedAt: string;
  id: number;
  updatedAt: string;
  writerNo: BettingWriterType;
  content: BettingCommentContentType;
}

interface BettingCommentsType {
  comment: BettingCommentType;
  user: BettingUserType;
}

const BettingComments = () => {
  const { id: bettingId } = useParams();
  const [comments, setComments] = useState<BettingCommentsType[]>();
  const [inputState, setInputState] = useState<string>("");

  const loadComments = useCallback(async () => {
    apiClient
      .get(`/betting-products/comments?bettingId=${bettingId}`)
      .then((res) => {
        setComments(res.data);
      });
  }, [bettingId]);

  useEffect(() => {
    loadComments();
  }, [bettingId, loadComments]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputState(e.target.value);
  };

  const handleClick = async () => {
    await apiClient.post("/betting-products/comments", {
      bettingId: bettingId,
      comment: inputState,
    });
    loadComments();
    setInputState("");
  };

  return (
    <>
      {/* <form onSubmit={handleSubmit} className="flex py-8"> */}
      <Input
        className="flex py-8"
        type="text"
        value={inputState}
        onChange={handleChange}
        endContent={
          <p onClick={handleClick} className="text-blue-700">
            Post
          </p>
        }
      />
      {/* <Button type="submit">Button</Button> */}
      {/* </form> */}
      <ul>
        {comments &&
          comments.map((comment, idx) => (
            <>
              <li key={idx} className="flex  px-4 py-4 shadow ">
                <BettingAccount
                  displayName={comment.user.displayName}
                  userName={comment.user.userName}
                  tier={comment.user.tierName}
                  avatarUrl={comment.user.userImg}
                />
                <p className="pl-4 flex items-center flex-1">
                  {comment.comment.content.comment}
                </p>
              </li>
            </>
          ))}
      </ul>
    </>
  );
};

export default BettingComments;
