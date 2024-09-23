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
import { BettingOptions, BettingProductInfo } from "@/types/BettingTypes";

function BettingProductDetail(props: BettingProductInfo) {
  const { user, product, productImages, options, optionsRatio } = props;

  return (
    <>
      <div className="px-6 pt-6">
        <div className="flex flex-1 items-center gap-x-2">
          {user && (
            <>
              <Account
                userName={user.userName}
                displayName={user.displayName}
                tier={user.tierName}
                avatarUrl={user.userImg}
              />
              {user.userID == product.userId && <Button>정산하기</Button>}
            </>
          )}
        </div>
        <div>
          <div>{product.title}</div>
          <div>{product.content}</div>
          <div
            className="
              w-full  h-auto flex
              gap-[10px]
              overflow-x-auto overflow-y-hidden whitespace-nowrap scrolling-touch ms-overflow-none
              scroll-snap-type-x mandatory scroll-smooth
            "
          >
            {/* TODO: 확대 미리보기 */}

            {productImages.map((url) => (
              <div
                key={url}
                className="flex-shrink-0 overflow-hidden rounded-md border border-gray-200 my-4 scroll-snap-align-start"
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${url}`}
                  className="h-28 w-28  object-scale-down object-center"
                  width={500}
                  height={500}
                />
              </div>
            ))}
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
      </div>
      {/* options={bettingInfo?.options || ({} as BettingOptions[])} */}
      <BettingOptionList options={options || []} optionsRatio={optionsRatio} />
      <BettingCommentActivityTabs options={options || []} />
    </>
  );
}

export default BettingProductDetail;
