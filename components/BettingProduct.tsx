"use client";

import Account from "./Account";
import {
  HeartIcon,
  ArrowUpTrayIcon,
  ChatBubbleOvalLeftIcon,
  ArrowPathIcon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/outline";

const BettingProduct = () => {
  return (
    <>
      <div>
        <div className="flex flex-1 items-center gap-x-2 px-4 py-4">
          <Account
            userName="바이든"
            avatarUrl=""
            displayName="바이든"
            tier=""
          />
        </div>
        {/* <div className="flex flex-1 items-center gap-x-2 px-4"> */}
        <div className="px-4">
          <div>주제 탭 바이든 VS 트럼프</div>
          <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 my-4">
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
