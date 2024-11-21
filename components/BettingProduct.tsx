"use client";

import { BettingProductType } from "@/types/BettingTypes";
import Account from "./Account";
import Link from "next/link";
import Image from "next/image";
import PostStatsNav from "./PostStatsNav";

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
    blindName,
    postStats,
    createdAt,
  } = props;

  return (
    <>
      <div>
        <Link href={`/betting/` + bettingId}>
          <div className="flex flex-1 items-center gap-x-2 px-4 py-4">
            {blindName === null ? (
              //    <Userinfo
              //    name={name}
              //    username={username}
              //    date={date}
              //    tierName="novice"
              //  />
              <Account
                userName={userName}
                avatarUrl={userImg}
                displayName={displayName}
                tier={tierName}
                date={createdAt}
              />
            ) : (
              <Account
                userName={""}
                avatarUrl={"/images/logo.png"}
                displayName={blindName}
                tier={""}
                date={createdAt}
              />
            )}
          </div>
          {/* <div className="flex flex-1 items-center gap-x-2 px-4"> */}
          <div className="px-4">
            <p className="text-5xl">{title}</p>
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
                    <Image
                      alt=""
                      src={url}
                      // layout="fill" // 반드시 추가: div 크기에 맞게 이미지를 꽉 채움
                      objectFit="fill" // 이미지 비율을 유지하면서 div를 채움
                      className="rounded-md h-full"
                      // className="h-full w-full object-scale-down object-center"
                      width={500}
                      height={500}
                    />
                  )}
                </div>
              ))}
            </div>
            <ul className="mt-4 mb-4 px-4 flex justify-between gap-x-10 xl:gap-x-14 text-xs text-slate-700  [&_li:first-child]:lg:flex [&_li]:flex [&_li]:items-center [&_li]:gap-x-2 [&_li:xl]:gap-x-3">
              {postStats && (
                <PostStatsNav
                  viewCount={postStats.viewCount}
                  commentsCount={postStats.commentsCount}
                  feedId={postStats.id.toString()}
                  isShare={postStats.isShare}
                  shareCount={postStats.shareCount}
                  isLike={postStats.isLike}
                  likesCount={postStats.likesCount}
                />
              )}
            </ul>
          </div>
        </Link>
      </div>
    </>
  );
};

export default BettingProduct;
