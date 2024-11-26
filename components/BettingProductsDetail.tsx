"use client";

import { use, useEffect, useState } from "react";
import Account from "./Account";
import AccountNavItem from "./AccountNavItem";
import Avatar from "./AvatarWithIcon";
import BettingOptionList from "./BettingOptionList";
import {
  HeartIcon,
  ArrowUpTrayIcon,
  ChatBubbleOvalLeftIcon,
  ArrowPathIcon,
  ChartBarSquareIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"; // Heroicons에서 아이콘 가져오기
import BettingCommentActivityTabs from "./BettingCommentActivityTabs";
import { BettingOptions, BettingProductInfo } from "@/types/BettingTypes";
import Image from "next/image";
import apiClient from "@handler/fetch/axios";
import { useParams } from "next/navigation";
import { AxiosError } from "axios";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import PostStatsNav from "./PostStatsNav";
import BettingAccount from "./BettingAccount";
import { useSseStore } from "@/hooks/useSseStore";
import BackButtonContainer from "./BackButton";

function BettingProductDetail(props: BettingProductInfo) {
  const { user, product, productImages, options, optionsRatio, postStats } =
    props;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [choiceOptionId, setChoiceOptionId] = useState<number>(0);
  const connect = useSseStore((state) => state.connect);
  const close = useSseStore((state) => state.close);
  const { id: bettingId } = useParams();

  useEffect(() => {
    const eventSource = connect(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/betting-products/connect/${bettingId}`
    );

    eventSource.onmessage = (event) => {
      console.log("SSE event received: ", event.data);
    };

    return () => {
      close(); // 컴포넌트가 언마운트될 때 SSE 연결 종료
    };
  }, [connect, close, bettingId]);

  useEffect(() => {
    if (
      options != undefined &&
      options != null &&
      options[0]?.optionId != undefined
    ) {
      setChoiceOptionId(options[0].optionId);
    }
  }, [options]);

  const params = useParams();

  const handleChoiceOption = (id: number) => {
    setChoiceOptionId(id);
  };

  const handleSettlement = async () => {
    try {
      const response = await apiClient.post(
        `/betting-products/settlement?productId=${params.id}&optionId=${choiceOptionId}`
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Response data:", error.response?.data?.error); // 서버 응답 데이터
      }
    }
  };

  const handleSettlementButton = () => {
    const serverDateTime = new Date(
      `${product.deadlineDate}T${product.deadlineTime}`
    );
    const currentDateTime = new Date();

    return currentDateTime >= serverDateTime;
  };

  console.log("postStats: ", postStats);
  const [showTooltip, setShowTooltip] = useState(false);

  // 날짜와 시간 포맷 변경
  const deadlineDateTime = new Date(
    `${product.deadlineDate}T${product.deadlineTime}`
  );
  const isValidDate = !isNaN(deadlineDateTime.getTime());
  const formattedDate = isValidDate
    ? deadlineDateTime.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const tooltipTime = isValidDate
    ? deadlineDateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <>
      <div className="sm:px-6 sm:pt-6 pt-2 px-2">
        <div className="flex flex-1 items-center gap-x-2">
          <div className="sm:hidden">
            <BackButtonContainer />
          </div>
          {user && (
            <>
              {product.isBlind == false ? (
                <BettingAccount
                  userName={user.userName}
                  displayName={user.displayName}
                  tier={user.tierName}
                  avatarUrl={user.userImg}
                />
              ) : (
                <BettingAccount
                  userName={""}
                  displayName={product.blindName}
                  tier={""}
                  avatarUrl={"/images/logo.png"}
                />
              )}
              <div className="flex flex-1 mt-0">
                <div className="flex items-center space-x-2">
                  {/* 시간 아이콘 */}
                  <ClockIcon className="w-4 h-4" />

                  {/* 날짜와 툴팁 */}
                  <span
                    className="flex flex-1 relative cursor-pointer"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    {formattedDate}
                    {showTooltip && (
                      <span className="absolute top-full left-0 mt-1 px-2 py-1 text-sm text-white bg-gray-800 rounded shadow-lg">
                        {tooltipTime}
                      </span>
                    )}
                  </span>
                </div>
              </div>
              {user.userID == product.userId &&
                product.winningOption == null &&
                handleSettlementButton() && (
                  <>
                    <Button
                      color="primary"
                      variant="solid"
                      radius="full"
                      className="py-2 px-2 bg-black"
                      onPress={onOpen}
                    >
                      정산하기
                    </Button>
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                      <ModalContent>
                        {(onClose) => (
                          <>
                            <ModalHeader className="flex flex-col gap-1">
                              정산하기
                            </ModalHeader>
                            <ModalBody>
                              {options && options.length > 1 && (
                                <RadioGroup
                                  label="승리를 발표할 옵션을 선택해주세요."
                                  defaultValue={options[0].optionId.toString()}
                                >
                                  {options.map((item) => {
                                    const optionId: string = `${item.optionId}`;
                                    return (
                                      <Radio
                                        key={optionId}
                                        value={optionId}
                                        onClick={() =>
                                          handleChoiceOption(item.optionId)
                                        }
                                      >
                                        {item.content}
                                      </Radio>
                                    );
                                  })}
                                </RadioGroup>
                              )}
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                color="danger"
                                variant="light"
                                className="px-2 py-2"
                                onPress={onClose}
                              >
                                취소
                              </Button>
                              <Button
                                color="primary"
                                className="px-2 py-2 bg-black"
                                onPress={onClose}
                                onClick={handleSettlement}
                              >
                                정산
                              </Button>
                            </ModalFooter>
                          </>
                        )}
                      </ModalContent>
                    </Modal>
                  </>
                )}
            </>
          )}
        </div>
        <div>
          <div className="product-container p-4 ">
            {/* Title */}
            <div className="product-title text-lg font-bold text-gray-800 mb-2">
              {product.title}
            </div>

            {/* Content */}
            <div className="product-content text-gray-600">
              {product.content}
            </div>
          </div>

          <div
            className="
              w-full  h-auto flex
              gap-[10px]
              overflow-x-auto overflow-y-hidden whitespace-nowrap scrolling-touch ms-overflow-none
              scroll-snap-type-x mandatory scroll-smooth
            "
          >
            {/* TODO: 확대 미리보기 */}

            {productImages.map((url) => (
              <div
                key={url}
                className="flex-shrink-0 overflow-hidden rounded-md border border-gray-200 my-4 scroll-snap-align-start"
              >
                <Image
                  alt=""
                  // layout="fill"
                  width={100}
                  height={60}
                  objectFit="fill"
                  src={url}
                  // className="h-28 w-28  object-scale-down object-center"
                  className="rounded-md h-full"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <ul className="mt-4 mb-4 px-4 flex justify-between gap-x-10 xl:gap-x-14 text-xs text-slate-700  [&_li:first-child]:lg:flex [&_li]:flex [&_li]:items-center [&_li]:gap-x-2 [&_li:xl]:gap-x-3">
            {/* 나머지 통계 정보 */}
            {postStats && Object.keys(postStats).length > 0 && (
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
      </div>
      {/* options={bettingInfo?.options || ({} as BettingOptions[])} */}
      <BettingOptionList
        options={options || []}
        optionsRatio={optionsRatio}
        winningOption={product?.winningOption}
      />
      <BettingCommentActivityTabs
        options={options || []}
        isBlind={product.isBlind}
      />
    </>
  );
}

export default BettingProductDetail;
