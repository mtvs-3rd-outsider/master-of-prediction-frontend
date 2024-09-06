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
    user_img: string;
    banner_img: string;
    user_name: string;
    bio: string;
    location: string;
    website: string;
    birthdate: string;
    joined_date: string;   // 변경됨
    gender: string;
    points: number;
    transactions: number;
    profit_rate: string;   // 변경됨
    position_value: string; // 변경됨
    trade_count: number;   // 변경됨
    following_count: number; // 변경됨
    follower_count: number;  // 변경됨
  };
};

// 데이터 페칭 함수: userId를 사용하여 API 요청
async function fetchUserData(userId: string) {
  return fetchWithBaseURL(`/my-channel/${userId}`);
}

const MyChannel: React.FC<MyChannelProps> = ({ user }) => {
  console.log(user);
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
        <UserBanner imageUrl={user.banner_img} />
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
            initials={user.user_name}
            size={80} // 아바타 크기를 동적으로 설정
            src={user.user_img}
          />
        </div>

        <div>
          <div className="inline-flex gap-1">
            <TierIcon name={"견습생"} size={23} className="px-2" />{" "}
            <h1 className="text-md m-auto font-bold">{user.user_name}</h1>{" "}
            <p className="text-xs mb-1 mt-auto text-gray-600">@{user.user_name}</p>
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
          {user.joined_date && <IconText icon={CalendarIcon} text={user.joined_date} />}
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
            <span className="text-xs font-bold">{user.profit_rate}</span>
            <span className="text-xs text-gray-600"> 손익률</span>
          </div>
          <div>
            <span className="text-xs font-bold">{user.position_value}</span>
            <span className="text-xs text-gray-600"> 포지션 가치</span>
          </div>
          <div>
            <span className="text-xs font-bold">{user.trade_count}</span>
            <span className="text-xs text-gray-600"> 거래수</span>
          </div>
        </div>
        <div className="flex mt-1 space-x-4">
          <div>
            <span className="text-xs font-bold">{user.following_count} </span>
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
            <span className="text-xs font-bold">{user.follower_count} </span>
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
