"use client";

import { useEffect, useState } from "react";
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

function BettingProductDetail(props: BettingProductInfo) {
  const { user, product, productImages, options, optionsRatio } = props;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [choiceOptionId, setChoiceOptionId] = useState<number>(0);

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

  return (
    <>
      <div className="px-6 pt-6">
        <div className="flex flex-1 items-center gap-x-2">
          {user && (
            <>
              {product.isBlind == false ? (
                <Account
                  userName={user.userName}
                  displayName={user.displayName}
                  tier={user.tierName}
                  avatarUrl={user.userImg}
                />
              ) : (
                <Account
                  userName={""}
                  displayName={product.blindName}
                  tier={""}
                  avatarUrl={"/images/logo.png"}
                />
              )}
              <p className="flex flex-1">
                ~{product.deadlineDate} {product.deadlineTime}
              </p>
              {user.userID == product.userId &&
                product.winningOption == null && (
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
          <div>{product.title}</div>
          <div>{product.content}</div>
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
                  src={url}
                  className="h-28 w-28  object-scale-down object-center"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <ul
            className="mt-4 mb-4 
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
