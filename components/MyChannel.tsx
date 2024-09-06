// components/MyChannel.tsx (클라이언트 컴포넌트)
"use client";
import React from "react";
import Avatar from "@components/radix/Avatar";
import TierIcon from "@components/TierIcon";
import UserBanner from "@components/user/UserBanner";
import { usePathname, useRouter } from 'next/navigation';
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
import fetchWithBaseURL from "@handler/fetch/fetch";
import Link from "next/link";

type MyChannelProps = {
  user?: {
    name: string;
    username: string;
    bio: string;
    location: string;
    website: string;
    birthdate: string;
    joinedDate: string;
    gender: string;
    points: number;
    transactions: number;
    profitRate: string;
    positionValue: string;
    tradeCount: number;
    followingCount: number;
    followerCount: number;
  };
};

// 데이터 페칭 함수: userId를 사용하여 API 요청
async function fetchUserData(userId: string) {
  return fetchWithBaseURL(`/my-channel/${userId}`);
}

const MyChannel: React.FC<MyChannelProps> = ({ user }) => {
  console.log(user)
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 가져오기

  const handleSubscribeClick = () => {
    router.push(`${pathname}/subscribe`);
  };

  const handleClick = () => {
    router.push('profile-edit');
  };

  // user가 없을 때 아무것도 렌더링하지 않도록 방어 코드 추가
  if (!user) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="sticky overflow-hidden">
        <UserBanner imageUrl="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2532&q=80" />
      </div>
      <div className="relative pt-2 flex justify-end gap-2 z-10">
        <Button
          isIconOnly
          radius="full"
          variant="light"
          aria-label="Options"
        >
          <EllipsisHorizontalIcon className="h-6 w-6" />
        </Button>
        <Button
          isIconOnly
          radius="full"
          variant="light"
          aria-label="Message"
        >
          <EnvelopeIcon className="h-6 w-6" />
        </Button>
        <Link href="profile-edit">
          <Button
            radius="full"
            variant="solid"
            className="font-bold px-3 py-2"
            color="primary"
          >
            프로필 수정
          </Button>
        </Link>
      </div>
      <div className="relative left-4 top-[-40px] mb-1 h-10 flex flex-col">
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

        <div>
          <div className="inline-flex gap-1">
            <TierIcon name={"견습생"} size={23} className="px-2" />{" "}
            <h1 className="text-md m-auto font-bold">{user.name}</h1>{" "}
            <p className="text-xs mb-1 mt-auto text-gray-600">@{user.username}</p>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-800">
          {user.bio}
        </p>
        <div className="flex-wrap gap-3 mt-3">
          {user.location && <IconText icon={MapPinIcon} text={user.location} />}
          {user.website && <IconText icon={LinkIcon} text={user.website} />}
          {user.birthdate && <IconText icon={CakeIcon} text={user.birthdate} />}
          {user.joinedDate && <IconText icon={CalendarIcon} text={user.joinedDate} />}
          {user.gender && <IconText icon={SwatchIcon} text={user.gender} />}
        </div>
        <div className="mt-4 flex space-x-1">
          <span className="text-xs font-bold">{user.points}</span>
          <span className="text-xs text-gray-600"> 내 포인트</span>
        </div>
        <div className="mt-2 flex space-x-4">
          <div>
            <span className="text-xs font-bold">{user.transactions}</span>{" "}
            <span className="text-xs text-gray-600"> 거래량</span>
          </div>
          <div>
            <span className="text-xs font-bold">{user.profitRate}</span>
            <span className="text-xs text-gray-600"> 손익률</span>
          </div>
          <div>
            <span className="text-xs font-bold">{user.positionValue}</span>
            <span className="text-xs text-gray-600"> 포지션 가치</span>
          </div>
          <div>
            <span className="text-xs font-bold">{user.tradeCount}</span>
            <span className="text-xs text-gray-600"> 거래수</span>
          </div>
        </div>
        <div className="flex mt-1 space-x-4">
          <div>
            <span className="text-xs font-bold">{user.followingCount} </span>
            <Link href={`${pathname}/subscribe`}>
            <Button
              variant="light"
              className="text-xs p-1 text-gray-600"
            >
              Followings
            </Button>
          </Link>
          </div>
          <div>
            <span className="text-xs font-bold">{user.followerCount} </span>
            <Link href={`${pathname}/subscribe`}>
            <Button
              variant="light"
              className="text-xs p-1 text-gray-600"
            >
              Followers
            </Button>
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyChannel;
