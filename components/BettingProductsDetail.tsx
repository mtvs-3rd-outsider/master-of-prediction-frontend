"use client";

import { useState } from "react";
import Account from "./Account";
import AccountNavItem from "./AccountNavItem";
import Avatar from "./AvatarWithIcon";
import Button from "./Button";
import BettingOptionList from "./BettingOptionList";
import {
  HeartIcon,
  ArrowUpTrayIcon,
  ChatBubbleOvalLeftIcon,
  ArrowPathIcon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/outline"; // Heroicons에서 아이콘 가져오기
import BettingCommentActivityTabs from "./BettingCommentActivityTabs";

function BettingProductDetail() {
  const [data, setData] = useState({});

  return (
    <>
      <div className="flex flex-1 items-center gap-x-2">
        <Account userId="1" />
        <Button>정산하기</Button>
      </div>
      {/* <div className="flex flex-1 items-center gap-x-2 px-4"> */}
      <div>
        <div>주제 탭 바이든 VS 트럼프</div>
        <div>내용 탭 다음 대선 바이든 VS 트럼프 누가 될까요?</div>
        <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <img
            src="https://flexible.img.hani.co.kr/flexible/normal/800/533/imgdb/original/2024/0417/20240417503416.jpg"
            alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
            className="h-full w-full object-cover object-center"
            width={500}
            height={500}
          />
        </div>
      </div>
      <div>
        <ul
          className="mt-4 mb-4 
        flex gap-x-10 xl:gap-x-14 text-xs text-slate-700 [&_li:first-child]:hidden [&_li:first-child]:lg:flex [&_li]:flex [&_li]:items-center [&_li]:gap-x-2 [&_li:xl]:gap-x-3 "
        >
          <li className="">
            <ChartBarSquareIcon className="w-5 h-5" />
            20
          </li>
          <li>
            <ChatBubbleOvalLeftIcon className="w-5 h-5" />2
          </li>
          <li>
            <ArrowPathIcon className="w-5 h-5" />1
          </li>
          <li>
            <HeartIcon className="w-5 h-5" />
            23
          </li>
          <li>
            <ArrowUpTrayIcon className="w-5 h-5" />
          </li>
        </ul>
      </div>
      <BettingOptionList />
      <BettingCommentActivityTabs />
    </>
  );
}

export default BettingProductDetail;