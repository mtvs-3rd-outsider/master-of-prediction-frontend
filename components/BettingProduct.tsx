"use client";

import { BettingProductType } from "@/types/BettingTypes";
import Account from "./Account";
import {
  HeartIcon,
  ArrowUpTrayIcon,
  ChatBubbleOvalLeftIcon,
  ArrowPathIcon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

// TODO: 현재는 title에만 배팅 상세 페이지로 이동하지만 빈 공간에 Link 주는 방법으로 교체해야함
const BettingProduct = (props: BettingProductType) => {
  const {
    userName,
    displayName,
    userImg,
    title,
    imgUrls,
    tierName,
    bettingId,
  } = props;
  return (
    <>
      <div>
        <div className="flex flex-1 items-center gap-x-2 px-4 py-4">
          <Account
            userName={userName}
            avatarUrl={userImg}
            displayName={displayName}
            tier={tierName}
          />
        </div>
        {/* <div className="flex flex-1 items-center gap-x-2 px-4"> */}
        <div className="px-4">
          <Link href={`/betting/` + bettingId}>
            <p className="text-5xl">{title}</p>
          </Link>
          {/* <div className="flex w-full"> */}
          <div
            className="
    w-full h-32
    flex pt-[10px] pr-[10px] pb-[10px] gap-[10px] items-start self-stretch shrink-0 flex-nowrap
    bg-[#ffffff] 
    overflow-x-auto overflow-y-hidden whitespace-nowrap scrolling-touch ms-overflow-none 
    scroll-snap-type-x mandatory scroll-smooth"
          >
            {/* TODO: 확대 미리보기 */}
            {imgUrls.map((url) => (
              <div
                key={url}
                className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 my-4 scroll-snap-align-start"
              >
                {url && (
                  // <img
                  //   src={`${url}`}
                  //   className="h-full w-full object-scale-down object-center"
                  //   width={500}
                  //   height={500}
                  // />
                  <Image
                    alt=""
                    src={url}
                    className="h-full w-full object-scale-down object-center"
                    width={500}
                    height={500}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <ul
            className="mt-4 mb-4 px-4
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
    </>
  );
};

export default BettingProduct;
