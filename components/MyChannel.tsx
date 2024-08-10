"use client";
import React from "react";
import Avatar from "@components/radix/Avatar";
import TierIcon from "@components/TierIcon";
import UserBanner from "@components/user/UserBanner";
import { Button } from "@nextui-org/button";
import {
  EllipsisHorizontalIcon,
  EnvelopeIcon,
  MapPinIcon,
  LinkIcon,
  CakeIcon,
  CalendarIcon,
  SwatchIcon
} from "@heroicons/react/24/outline";
import IconText from "./IconText";
import Link from "next/link";

const MyChannel: React.FC = () => {
  return (
    <div className="p-4 ">
      <div className="sticky  overflow-hidden ">
        <UserBanner imageUrl="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2532&q=80" />
      </div>
      <div className="relative pt-2 flex justify-end gap-2 z-10">
        <Button
          isIconOnly
          radius="full"
          variant="light"
          aria-label="Take a photo"
        >
          <EllipsisHorizontalIcon className="h-6 w-6" />
        </Button>
        <Button
          isIconOnly
          radius="full"
          variant="light"
          aria-label="Take a photo"
        >
          <EnvelopeIcon className="h-6 w-6" />
        </Button>
        <Link href="profile-edit">
      <Button radius="full"  variant="solid" className="font-bold p-3">
        프로필 수정
      </Button>
    </Link>
      </div>
      <div className="relative left-4 top-[-40px] mb-1 h-10 flex flex-col ">
        <div
          className="relative left-4 top-[-40px] mb-1 h-10"
          style={{
            transformOrigin: "bottom center",
          }}
        >
          <Avatar
            alt="User Avatar"
            initials="RQ"
            size={80} // 아바타 크기를 동적으로 설정
          />
        </div>

        <div >
          <div className="inline-flex gap-1">
            <TierIcon name={"견습생"} size={23} className="px-2" />{" "}
            <h1 className="text-md m-auto font-bold">홍길동</h1>{" "}
            <p className="text-xs  mb-1 mt-auto text-gray-600">@홍길동</p>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-800">
          This is a short bio about the user.
        </p>
        <div className="flex-wrap gap-3 mt-3">
          <IconText icon={MapPinIcon} text="Earth" />
          <IconText icon={LinkIcon} text="master-of-prediction.com" />
          <IconText icon={CakeIcon} text="November 7,1987" />
          <IconText icon={CalendarIcon} text="Joined November 2010" />
          <IconText icon={CalendarIcon} text="Joined November 2010" />
          <IconText icon={SwatchIcon} text="남" />
        </div>
        <div className="mt-4 flex space-x-1">
          <span className="text-xs font-bold">30000</span>
          <span className="text-xs text-gray-600"> 내 포인트</span>
        </div>
        <div className="mt-2 flex space-x-4">
          <div>
            <span className="text-xs font-bold">100</span>{" "}
            <span className="text-xs text-gray-600"> 거래량</span>
          </div>
          <div>
            <span className="text-xs font-bold">200%</span>
            <span className="text-xs text-gray-600"> 손익률</span>
          </div>
          <div>
            <span className="text-xs font-bold">200p</span>
            <span className="text-xs text-gray-600"> 포지션 가치</span>
          </div>
          <div>
            <span className="text-xs font-bold">200</span>
            <span className="text-xs text-gray-600"> 거래수</span>
          </div>
        </div>
        <div className="flex mt-1 space-x-4">
          <div>
            <span className="text-xs font-bold">100 </span>
            <Button variant="light" className="text-xs  p-1 text-gray-600"> Followings</Button>
          </div>
          <div>
            <span className="text-xs font-bold">200 </span>
            <Button variant="light" className="text-xs p-1 text-gray-600"> Followers</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyChannel;
