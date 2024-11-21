"use client";

import { BettingActivityType } from "@/types/BettingActivityType";
import apiClient from "@handler/fetch/axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BettingAccount from "./BettingAccount";
import { useTranslations } from "next-intl";
import { useTranslationStore } from "@store/useTranslationStore";

interface Props {
  activity: BettingActivityType[];
}

const getTimeDifference = (orderDate: string, orderTime: string): string => {
  const messages = useTranslationStore.getState().messages;

  // 현재 날짜와 시간을 가져옴
  const currentDate = new Date();

  // 서버에서 전달된 orderDate와 orderTime을 합쳐서 Date 객체로 변환
  const orderDateTime = new Date(`${orderDate}T${orderTime}`);

  // 밀리초 단위로 시간 차이를 계산
  const diffInMilliseconds = currentDate.getTime() - orderDateTime.getTime();

  // 초, 분, 시간, 날짜 단위로 변환
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // 차이를 초, 분, 시간, 날짜 단위로 반환 (다국어 처리)
  if (diffInSeconds < 60) {
    return `${diffInSeconds}${messages["초"]}`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}${messages["분"]}`;
  } else if (diffInHours < 24) {
    return `${diffInHours}${messages["시간"]}`;
  } else {
    return `${diffInDays}${messages["일"]}`;
  }
};


const BettingActivity = ({ activity }: Props) => {
 const messages = useTranslationStore.getState().messages;

  return (
    <>
      {/* 유저 프로필, 어떤 옵션을, 얼만큼, 구매 or 판매 */}
      <div className="gap-8">
        {activity &&
          activity.map((node, i) => (
            <div key={i} className="flex gap-4 shadow py-4 pl-8 pr-8 px-8">
              <BettingAccount
                userName={node.userName}
                displayName={node.displayName}
                tier={node.tierName}
                avatarUrl={node.userImg}
              />
              {node.point < 0 ? (
                <div className="flex justify-center items-center gap-4">
                  <span className=" font-bold text-red-500">sold </span>
                  <span className="font-bold">{node.content}</span>
                  <span> {node.point * -1}p</span>
                </div>
              ) : (
                <div className="flex justify-center items-center gap-4">
                  <span className="font-bold text-green-600 ">
                    {messages["구매"]}{" "}
                  </span>
                  <span className="font-bold">{node.content}</span>
                  <span> {node.point}p</span>
                </div>
              )}
              <div className="flex justify-center items-center">
                <span>{getTimeDifference(node.orderDate, node.orderTime)}</span>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default BettingActivity;
