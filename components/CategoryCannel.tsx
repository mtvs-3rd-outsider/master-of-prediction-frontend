"use client";
import React from "react";
import TierIcon from "@components/TierIcon";
import UserBanner from "@components/user/UserBanner";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import {
  EllipsisHorizontalIcon,
  EnvelopeIcon,
  MapPinIcon,
  LinkIcon,
  CakeIcon,
  CalendarIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import IconText from "./IconText";
import Link from "next/link";

type CategoryChannelProps = {
  channel?: {
    name: string;
    banner_img: string;
    bio: string;
    location: string;
    website: string;
    created_at: string;
    category: string;
    follower_count: number;
    following_count: number;
  };
};

const CategoryChannel: React.FC<CategoryChannelProps> = ({ channel }) => {
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 가져오기

  const handleSubscribeClick = () => {
    router.push(`${pathname}/subscribe`);
  };

  const handleEditClick = () => {
    router.push("category-edit");
  };

  // channel이 없을 때 아무것도 렌더링하지 않도록 방어 코드 추가
  if (!channel) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="sticky overflow-hidden">
        <UserBanner imageUrl={channel.banner_img} />
      </div>
      <div className="relative pt-2 flex justify-end gap-2 z-10">
        <Button isIconOnly radius="full" variant="light" aria-label="Options">
          <EllipsisHorizontalIcon className="h-6 w-6" />
        </Button>
        <Button isIconOnly radius="full" variant="light" aria-label="Message">
          <EnvelopeIcon className="h-6 w-6" />
        </Button>
        <Link href="category-edit">
          <Button
            radius="full"
            variant="solid"
            className="font-bold px-3 py-2"
            color="primary"
          >
            카테고리 수정
          </Button>
        </Link>
      </div>

      <div className="mt-2">
        <div className="inline-flex gap-1">
          <TierIcon name={channel.category} size={35} className="px-2" />
          <h1 className="text-md m-auto font-bold">{channel.name}</h1>
        </div>

        <p className="text-sm text-gray-800">
          {channel.bio?.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </p>
        <div className="flex-wrap gap-3 mt-3">
          {channel.location && <IconText icon={MapPinIcon} text={channel.location} />}
          {channel.website && (
            <IconText
              icon={LinkIcon}
              text={<a href={channel.website} target="_blank" rel="noopener noreferrer">{channel.website}</a>}
            />
          )}
          {channel.created_at && <IconText icon={CalendarIcon} text={channel.created_at} />}
        </div>

        <div className="mt-4 flex space-x-4">
          <div>
            <span className="text-xs font-bold">{channel.following_count}</span>
            <Link href={`${pathname}/following`}>
              <Button variant="light" className="text-xs p-1 text-gray-600">
                Followings
              </Button>
            </Link>
          </div>
          <div>
            <span className="text-xs font-bold">{channel.follower_count}</span>
            <Link href={`${pathname}/followers`}>
              <Button variant="light" className="text-xs p-1 text-gray-600">
                Followers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryChannel;
