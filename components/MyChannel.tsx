// components/MyChannel.tsx (클라이언트 컴포넌트)
"use client";
import React, { useEffect, useState } from "react";
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
import Link from "next/link";
import useUserStore from "@store/useUserStore";
import apiClient from "@handler/fetch/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import useOptimisticMutation from "@handler/useOptimisticMutation";
import { MyChannelProps } from "@/app/[locale]/(home)/channel/[userId]/page";
import DropdownNext from "./DropdownAccountNavItem";
import { useTranslations } from "next-intl";
import TierBadge, { tierLabels } from "./TierBadge";


// 구독 상태를 서버에서 가져오는 함수
interface UserChannelPageProps {
  user: MyChannelProps; // 서버에서 전달받은 유저 데이터
}

const MyChannel: React.FC<UserChannelPageProps> = ({ user }) => {
  const t = useTranslations();

  const fetchFollowers = async (channelId?: string) => {
    const response = await apiClient.get(
      `/subscriptions/channel/${channelId}/subscribers/count?isUserChannel=true`
    );
    setFollowerCount(response.data);
    return response.data;
  };

  // 팔로잉 목록을 가져오는 함수
  const fetchFollowing = async (channelId?: string) => {
    const response = await apiClient.get(
      `/subscriptions/user/${channelId}/following/count?isUserChannel=true`
    );
    setFollowingCount(response.data);
    return response.data;
  };
  const fetchSubscriptionStatus = async (channelId?: string) => {
    const response = await apiClient.get(
      `/subscription?channelId=${channelId}&isUserChannel=true`
    );
    setIsSubscribed(response.data);
    return response.data;
  };
  const [isSubscribed, setIsSubscribed] = useState(false); // 로컬 구독 상태
  const [followerCount, setFollowerCount] = useState(0); // 로컬 구독 상태
  const [followingCount, setFollowingCount] = useState(0); // 로컬 구독 상태
  const userInfo = useUserStore((state) => state?.userInfo);
  console.log(user);
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 가져오기

  const handleSubscribeClick = () => {
    router.push(`${pathname}/subscribe`);
  };

  const handleClick = () => {
    router.push("profile-edit");
  };
  const isLoggedIn = Boolean(userInfo); // 로그인 여부를 확인하는 추가 코드
  // 현재 채널이 내 채널인지 검증 (user.user_name과 현재 로그인한 사용자를 비교)
  const isMyChannel = user?.userId == userInfo?.id;
  const { isLoading } = useQuery({
    queryKey: ["subscriptionStatus", user?.userId], // queryKey로 검색 쿼리를 관리
    queryFn: () => fetchSubscriptionStatus(user?.userId), // 검색 API 호출 함수
    enabled: isLoggedIn && !isMyChannel, // searchQuery가 존재할 때만 요청 수행
    staleTime: 0, // 5분 동안 캐시 상태 유지
    refetchOnMount: "always",
  });
  const { isLoading: isFollowersLoading } = useQuery({
    queryKey: ["followerCount", user?.userId],
    queryFn: () => fetchFollowers(user?.userId),
    enabled: !!user?.userId, // userId가 있을 때만 호출
    staleTime: 0, // 캐시 시간 5분
    refetchOnMount: "always",
  });

  const { isLoading: isFollowingLoading } = useQuery({
    queryKey: ["followingCount", user?.userId],
    queryFn: () => fetchFollowing(user?.userId),
    enabled: !!user?.userId, // userId가 있을 때만 호출
    staleTime: 0, // 캐시 시간 5분
    refetchOnMount: "always",
  });

  const fetchSubscripition = async (actionType: string) => {
    return apiClient.post(`/channel/subscription`, {
      channelId: user?.userId,
      isUserChannel: true,
      actionType: actionType,
    });
  };
  // 구독/구독 취소 API 요청을 처리하는 mutation
  const toggleSubscription = useOptimisticMutation({
    queryKey: ["subscriptionStatus", user?.userId], // 쿼리 키를 명확하게 설정
    mutationFn: () =>
      fetchSubscripition(!isSubscribed ? "unsubscribe" : "subscribe"),
    onMutateFn: async () => {
      // 낙관적 업데이트: 버튼 클릭 시 즉시 상태 변경
      setIsSubscribed((prev) => !prev);
      setFollowerCount((prev) => prev + (isSubscribed ? -1 : 1)); // 낙관적 followingCount 업데이트
    },
    onErrorFn: (error) => {
      // 에러가 발생하면 이전 상태로 롤백
      setIsSubscribed((prev) => !prev);
      setFollowerCount((prev) => prev + (isSubscribed ? 1 : -1)); // 롤백 followingCount 상태
    },
  });

  // 구독/구독 취소 버튼 클릭 핸들러
  const handleSubscribeToggle = () => {
    toggleSubscription.mutate(null);
  };

  // user가 없을 때 아무것도 렌더링하지 않도록 방어 코드 추가
  if (!user) {
    return null;
  }

  return (
    <div className="px-4 pt-4">
      <div className="relative overflow-auto">
        <UserBanner imageUrl={user.banner_img} />
      </div>
      <div className="relative pt-2 flex justify-between gap-2 z-10">
        <div className=" left-4 top-[-40px] mb-1  flex flex-col">
        <div
          className=" left-4 top-[-40px] mb-1 "
          style={{
            transformOrigin: "bottom center",
          }}
        >
          <Avatar
            alt="User Avatar"
            initials={user?.user_name}
            size={80}
            src={user?.user_img}
          />
        </div>

        <div>
          <div className="inline-flex gap-1">
            {tierLabels[user.tier_name] && (
              <TierBadge name={user.tier_name}  />
            )}
            <h1 className="text-md m-auto font-bold">
              {user.display_name || user.user_name}
            </h1>{" "}
            <p className="text-xs mb-1 mt-auto text-gray-600">
              @{user.user_name}
            </p>
          </div>
        </div>
      </div>
        {isMyChannel ? (
          <div>
            <DropdownNext />
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
        ) : (
          isLoggedIn &&
          !isLoading && ( // 로그인한 상태에서만 구독 버튼이 보이고 로딩 중에는 버튼 숨김
            <Button
              radius="full"
              className="font-bold px-3 py-2"
              color="primary"
              variant={isSubscribed ? "bordered" : "solid"}
              onClick={handleSubscribeToggle}
            >
              {isSubscribed ? "구독 취소" : "구독"}
            </Button>
          )
        )}
      </div>
      
      <div className="mt-2">
        <div className="text-sm text-gray-800">
          {user.bio?.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </div>
        <div className="flex-wrap gap-3 mt-3">
          {user.location && <IconText icon={MapPinIcon} text={user.location} />}
          {user.website && (
            <IconText
              icon={LinkIcon}
              text={
                <Link
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.website}
                </Link>
              }
            />
          )}
          {user.birthdate && <IconText icon={CakeIcon} text={user.birthdate} />}
          {user.joined_date && (
            <IconText icon={CalendarIcon} text={user.joined_date} />
          )}
          {user.user_gender && (
            <IconText icon={SwatchIcon} text={user.user_gender} />
          )}
        </div>
        <div className="mt-4 flex space-x-1">
          <span className="text-xs font-bold">{user.user_point}</span>
          <span className="text-xs text-gray-600"> 내 포인트</span>
        </div>
        {/* <div className="mt-2 flex space-x-4">
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
        </div> */}
        <div className="flex mt-1 space-x-4">
          <div>
            <span className="text-xs font-bold">{followerCount} </span>
            <Link href={`${pathname}/subscribe`}>
              <Button variant="light" className="text-xs p-1 text-gray-600">
                {t("팔로워")}
              </Button>
            </Link>
          </div>
          <div>
            <span className="text-xs font-bold">{followingCount} </span>
            <Link href={`${pathname}/subscribe`}>
              <Button variant="light" className="text-xs p-1 text-gray-600">
                {t("팔로잉")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyChannel;
