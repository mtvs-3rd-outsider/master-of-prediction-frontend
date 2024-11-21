"use client";

import React, { useState } from "react";
import TierIcon from "@components/TierIcon";
import UserBanner from "@components/user/UserBanner";
import { usePathname, useRouter } from "next/navigation";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  useDisclosure,
} from "@nextui-org/modal";
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
import useUserStore from "@store/useUserStore";

type CategoryChannelDTO = Partial<{
  channelId: string;
  displayName: string;
  description: string;
  communityRule: string;
  imageUrl: string;
  bannerImg: string;
  userCount: number;
}>;

type CategoryChannelProps = {
  channel: CategoryChannelDTO;
};

// 소유권 확인 API 호출 함수
const fetchIsOwner = async (channelId: string, userId: string) => {
  const { data } = await apiClient.get(
    `/category-channels/${channelId}/ownership?userId=${userId}`
  );
  return data;
};

const CategoryChannel: React.FC<CategoryChannelProps> = ({ channel }) => {
  const subscribeToChannel = async (channelId: string, actionType: string) => {
    await apiClient.post("/channel/subscription", {
      channelId: channelId,
      isUserChannel: false,
      actionType: actionType,
    });
  };

  const fetchSubscriptionStatus = async (channelId?: string) => {
    const response = await apiClient.get(
      `/subscription?channelId=${channelId}&isUserChannel=false`
    );
    setIsSubscribed(response.data);
    return response.data;
  };

  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState<number>(
    channel.userCount!
  );

  const userInfo = useUserStore((state) => state.userInfo);
  const userId = userInfo?.id;
  const isLoggedIn = Boolean(userId);

  const { data: isOwner, isLoading: isOwnerLoading } = useQuery({
    queryKey: ["isOwner", channel?.channelId, userId],
    queryFn: () => fetchIsOwner(channel?.channelId!, userId!),
    enabled: !!channel?.channelId && !!userId,
    refetchOnMount: "always",
    staleTime: 0,
  });

  const { isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ["subscriptionStatus-channel", channel?.channelId],
    queryFn: () => fetchSubscriptionStatus(channel?.channelId?.toString()),
    enabled: isLoggedIn && !isOwner,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const subscribeMutation = useOptimisticMutation({
    queryKey: ["subscriptionStatus-channel", channel?.channelId],
    mutationFn: () =>
      subscribeToChannel(
        channel?.channelId!,
        isSubscribed ? "subscribe" : "unsubscribe"
      ),
    onMutateFn: async () => {
      setIsSubscribed((prev) => !prev);
      setSubscriberCount((prev) => prev + (isSubscribed ? -1 : 1));
    },
    onErrorFn: (error) => {
      setIsSubscribed((prev) => !prev);
      setSubscriberCount((prev) => prev + (isSubscribed ? -1 : 1));
    },
  });

  const handleSubscribeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    subscribeMutation.mutate(channel?.channelId);
  };

  const handleEditClick = () => {
    router.push("category-edit");
  };

  if (!channel) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="sticky overflow-hidden">
        {channel?.bannerImg && <UserBanner imageUrl={channel.bannerImg} />}
      </div>
      <div className="relative pt-2 flex justify-end gap-2 z-10">
        {/* <Button isIconOnly radius="full" variant="light" aria-label="Options">
          <EllipsisHorizontalIcon className="h-6 w-6" />
        </Button>
        <Button isIconOnly radius="full" variant="light" aria-label="Message">
          <EnvelopeIcon className="h-6 w-6" />
        </Button> */}

        {isOwnerLoading || isSubscriptionLoading ? (
          <p>Loading...</p>
        ) : isOwner ? (
          <>
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
          </>
        ) : (
          isLoggedIn && (
            <Button
              radius="full"
              variant={isSubscribed ? "bordered" : "solid"}
              className="font-bold px-3 py-2 z-20"
              color="primary"
              onClick={handleSubscribeClick}
            >
              {isSubscribed ? "구독 중" : "구독"}
            </Button>
          )
        )}
      </div>

      <div className="mt-2">
        <div className="inline-flex gap-1">
          <h1 className="text-md m-auto font-bold">
            {channel?.displayName || "기본 이름"}
          </h1>
        </div>

        {channel?.description && (
          <p className="text-sm text-gray-800">
            {channel.description
              .split("\n")
              .map((line: string, index: number) => (
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
        </div>
      </div>

      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Community Rules
              </ModalHeader>
              <ModalBody>
                {channel?.communityRule ? (
                  <>
                    {(() => {
                      try {
                        const rulesArray = JSON.parse(channel.communityRule);
                        return Array.isArray(rulesArray) &&
                          rulesArray.length > 0 ? (
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
