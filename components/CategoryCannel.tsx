"use client";

import React, { useState } from "react";
import TierIcon from "@components/TierIcon";
import UserBanner from "@components/user/UserBanner";
import { usePathname, useRouter } from "next/navigation";
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalContent, useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import {
  EllipsisHorizontalIcon,
  EnvelopeIcon,
  LinkIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import IconText from "./IconText";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@api/axios";
import useOptimisticMutation from "@handler/useOptimisticMutation";

type CategoryChannelDTO = Partial<{
  channelId: number;
  displayName: string;
  description: string;
  communityRule: string;
  imageUrl: string;
  bannerImg: string;
  userCount: number;
}>;

type CategoryChannelProps = {
  channel: CategoryChannelDTO; // props로 전달되는 카테고리 데이터
};

// 소유권 확인 API 호출 함수
const fetchIsOwner = async (channelId: number, userId: number) => {
  const { data } = await apiClient.get(`/category-channels/${channelId}/ownership?userId=${userId}`);
  return data;
};

// 구독 상태 확인 API 호출 함수



const CategoryChannel: React.FC<CategoryChannelProps> = ({ channel }) => {

  const subscribeToChannel = async (channelId: number,actionType:string) => {
    await apiClient.post("/channel/subscription", { channelId: channelId, isUserChannel:false ,actionType:actionType});
  };
  
  // 구독 API 호출 함수
  const fetchSubscriptionStatus = async (channelId?: string) => {
    const response  = await apiClient.get(`/subscription?channelId=${channelId}&isUserChannel=false`);
    setIsSubscribed(response.data); // 구독 상태 업데이트
    return response.data;
  };
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount , setSubscriberCount ]= useState<number>(channel.userCount!);
  // 사용자 ID는 전역 상태나 로그인 상태에서 가져올 수 있다고 가정
  const userInfo = { id: 1 }; // 예시 사용자 정보, 실제로는 로그인 정보를 기반으로 가져와야 함
  const userId = userInfo.id;

  const isLoggedIn = Boolean(userId);

  // useQuery로 소유권 확인
  const { data: isOwner, isLoading: isOwnerLoading } = useQuery({
    queryKey: ['isOwner', channel?.channelId, userId],
    queryFn: () => fetchIsOwner(channel?.channelId!, userId),
    enabled: !!channel?.channelId && !!userId,
    refetchOnMount: "always",
    staleTime: 0,
  });

  // useQuery로 구독 상태 확인
  const { isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ['subscriptionStatus-channel', channel?.channelId], // queryKey로 구독 상태 관리
    queryFn: () => fetchSubscriptionStatus(channel?.channelId?.toString()), // 구독 상태 API 호출 함수
    enabled: isLoggedIn && !isOwner, // 로그인 상태 및 내 채널이 아닌 경우만 실행
 
    staleTime:0, // 5분 동안 캐시 상태 유지
    refetchOnMount: "always",
  });

  // 구독 Mutation
// 구독/구독 취소 API 요청을 처리하는 mutation
const subscribeMutation  = useOptimisticMutation({
  queryKey:  ["subscriptionStatus-channel", channel?.channelId], // 쿼리 키를 명확하게 설정
  mutationFn:()=> subscribeToChannel(channel?.channelId!,isSubscribed ? "subscribe" : "unsubscribe"),
    onMutateFn: async () => {
      // 낙관적 업데이트: 버튼 클릭 시 즉시 상태 변경
      setIsSubscribed((prev) => !prev);
      setSubscriberCount((prev) => prev + (isSubscribed ? -1 : 1)); // 낙관적 followingCount 업데이트
    },
    onErrorFn: (error) => {
      // 에러가 발생하면 이전 상태로 롤백
      setIsSubscribed((prev) => !prev);
      setSubscriberCount((prev) => prev + (isSubscribed ? -1 : 1)); // 낙관적 followingCount 업데이트
    }
});

const handleSubscribeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  subscribeMutation.mutate(channel?.channelId); // 순수한 데이터만 전송
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
        {channel?.bannerImg && <UserBanner imageUrl={channel.bannerImg} />}
      </div>
      <div className="relative pt-2 flex justify-end gap-2 z-10">
        <Button isIconOnly radius="full" variant="light" aria-label="Options">
          <EllipsisHorizontalIcon className="h-6 w-6" />
        </Button>
        <Button isIconOnly radius="full" variant="light" aria-label="Message">
          <EnvelopeIcon className="h-6 w-6" />
        </Button>

        {/* 소유자인 경우 수정 버튼, 아닌 경우 구독 버튼 */}
        {isOwnerLoading || isSubscriptionLoading ? (
          <p>Loading...</p>
        ) : isOwner ? (
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
        ) : (
          <Button
            radius="full"
            variant={isSubscribed ? "bordered" :"solid"}
            className="font-bold px-3 py-2 z-20"
            color="primary"
            onClick={handleSubscribeClick}
          >
            {isSubscribed ? "구독 중" : "구독"}
          </Button>
        )}
      </div>

      <div className="mt-2">
        <div className="inline-flex gap-1">
          <TierIcon name={channel?.displayName || "기본 이름"} size={35} className="px-2" />
          <h1 className="text-md m-auto font-bold">{channel?.displayName || "기본 이름"}</h1>
        </div>

        {channel?.description && (
          <p className="text-sm text-gray-800">
            {channel.description.split("\n").map((line: string, index: number) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </p>
        )}

        <div className="flex-wrap gap-3 mt-3">
          {channel?.communityRule && (
            <Button variant="light" color="primary" onPress={onOpen}>
              <IconText icon={LinkIcon} text="규칙 보기" />
            </Button>
          )}
          {channel?.userCount && channel.userCount > 0 && (
            <IconText
              icon={UserGroupIcon}
              text={`구독자 ${channel.userCount}명`}
            />
          )}
        </div>
      </div>

      {/* Modal for displaying community rules */}
      <Modal
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Community Rules</ModalHeader>
              <ModalBody>
                {channel?.communityRule ? (
                  <>
                    {(() => {
                      try {
                        const rulesArray = JSON.parse(channel.communityRule); // 문자열 배열 파싱
                        return Array.isArray(rulesArray) && rulesArray.length > 0 ? (
                          rulesArray.map((rule: string, index: number) => (
                            <p key={index}>
                              {index + 1}. {rule}
                            </p>
                          ))
                        ) : (
                          <p>No rules available.</p>
                        );
                      } catch (error) {
                        console.error("Error parsing communityRule:", error);
                        return <p>Invalid rule format.</p>;
                      }
                    })()}
                  </>
                ) : (
                  <p>No rules available.</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CategoryChannel;
