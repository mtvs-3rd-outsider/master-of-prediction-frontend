"use client";

import { BettingOptionChoiceStore } from "@/hooks/GlobalBettingOption";
import { OrderHistoryType } from "@/types/BettingOrderType";
import { BettingOptions } from "@/types/BettingTypes";
import apiClient from "@handler/fetch/axios";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { useRouter } from "next/navigation";

interface Props {
  userPoint: number;
  options: BettingOptions[] | [];
  orderHistory: OrderHistoryType[];
  optionsByOptionId: BettingOptions;
  choiceOptionhistory: OrderHistoryType;
  setUserPoint: React.Dispatch<React.SetStateAction<number>>;
  setOrderHistory: React.Dispatch<React.SetStateAction<OrderHistoryType[]>>;
  onCloseModal?: () => void; // 모달 닫기 함수 추가
  handleEvent?: () => void;
  onOpenAlert: (
    title: string,
    description: string,
    confirmHandler: () => void
  ) => void;
}

const SellOrder = ({
  userPoint,
  options,
  orderHistory,
  setUserPoint,
  setOrderHistory,
  optionsByOptionId,
  choiceOptionhistory,
  onCloseModal,
  handleEvent,
  onOpenAlert,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const bettingId = useParams().id;
  const { optionId } = BettingOptionChoiceStore();
  const t = useTranslations();
  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    if (choiceOptionhistory.point == undefined) {
      setAmount(0);
      return;
    }
    if (Number(newAmount) > choiceOptionhistory.point) {
      setAmount(choiceOptionhistory.point);
      return;
    }
    setAmount(newAmount === "" ? 0 : Number(newAmount));
  };

  const handleOpen = () => {
    if (amount > 0) {
      setOpen(true);
      if (handleEvent) {
        handleEvent(); // 모달 닫기 함수 호출
      }
      if (onCloseModal) {
        onCloseModal(); // 모달 닫기 함수 호출
      }
    }
  };

  const handleSell = () => {
    /**
     * 판매 api 전송
     * history 변경
     *  */
     if (onCloseModal) {
       onCloseModal(); // 모달 닫기 함수 호출
     }
     const confirmHandler = () => {
        if (choiceOptionhistory.point == undefined) {
          return;
        }
        if (amount > choiceOptionhistory.point) {
          alert("포인트가 부족합니다");
          return;
        }
        apiClient
          .post(`/betting-orders/sell/${bettingId}`, {
            bettingId: bettingId,
            point: amount,
            bettingOptionId: optionId,
          })
          .then((res) => {
            if (res.status <= 299) {
              setUserPoint(userPoint + amount);
              setAmount(0);
              // optionId를 찾고 point를 찾아 더한다, 없으면 추가
              setOrderHistory((prev) => {
                return prev.map((order) =>
                  order.bettingOptionId === res.data?.bettingOptionId
                    ? { ...order, point: order.point + res.data?.point }
                    : order
                );
              });
            }
          });
     };
    onOpenAlert("판매 확인", "정말로 판매하시겠습니까?", confirmHandler);
  
  };

  return (
    <>
      <fieldset className="mb-[15px] w-full flex flex-col justify-start">
        <label
          className="text-[13px] leading-none mb-2.5 text-violet12 block"
          htmlFor="username"
        >
          {t("배팅 상세페이지 금액")}
        </label>
        <input
          type="number"
          className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
          id="username"
          value={amount.toString()}
          onChange={handleAmount}
        />
      </fieldset>
      <div className="flex w-full h-[25px] justify-between items-center relative z-[36] mt-4 mr-0 mb-0 ">
        <span className="shrink-0 font-['Inter'] text-[14px] font-medium leading-[20px] text-[#5a6689] relative text-left whitespace-nowrap">
          Total
        </span>
        <div className="flex h-[25px]  items-center shrink-0 relative z-[32]">
          <span className="h-[20px] shrink-0 font-['Inter'] text-[14px] font-semibold leading-[20px] text-[#303648] relative text-left whitespace-nowrap z-[31]">
            {amount}
          </span>
          <span className="h-[20px] shrink-0 font-['Inter'] text-[14px] font-medium leading-[20px] text-[#76809d] relative text-left whitespace-nowrap z-[32]">
            point
          </span>
        </div>
      </div>
      <div className="flex w-full h-[17px] justify-between items-center relative z-[37] mt-[-4px] mr-0 mb-0 ">
        <span className="h-[15px] shrink-0 font-['Inter'] text-[12px] font-medium leading-[15px] text-[#5a6689] relative text-left whitespace-nowrap z-[37]">
          {t("배팅 상세페이지 회원 포인트")}
        </span>
        <div className="flex w-[73px] h-[17px] justify-between items-center shrink-0 relative z-[35]">
          <span className="flex w-[38px] h-[16px] justify-end items-start shrink-0 font-['Inter'] text-[12px] font-medium leading-[16px] text-[#303648] relative text-right whitespace-nowrap z-[34]">
            {userPoint}
          </span>
          <span className="flex w-[33px] h-[16px] justify-end items-start shrink-0 font-['Inter'] text-[12px] font-medium leading-[16px] text-[#76809d] relative text-right whitespace-nowrap z-[35]">
            point
          </span>
        </div>
      </div>
      <div className="flex w-full h-[17px] justify-between items-center relative z-[37] mt-[-4px] mr-0 mb-0 ">
        <span className="h-[15px] shrink-0 font-['Inter'] text-[12px] font-medium leading-[15px] text-[#5a6689] relative text-left whitespace-nowrap z-[37]">
          {t("배팅 상세페이지 구매한 포인트")}
        </span>
        <div className="flex w-[73px] h-[17px] justify-between items-center shrink-0 relative z-[35]">
          <span className="flex w-[38px] h-[16px] justify-end items-start shrink-0 font-['Inter'] text-[12px] font-medium leading-[16px] text-[#303648] relative text-right whitespace-nowrap z-[34]">
            {choiceOptionhistory.point | 0}
          </span>
          <span className="flex w-[33px] h-[16px] justify-end items-start shrink-0 font-['Inter'] text-[12px] font-medium leading-[16px] text-[#76809d] relative text-right whitespace-nowrap z-[35]">
            point
          </span>
        </div>
      </div>
      <div className="flex justify-end mt-1 ">
        <button
          onClick={handleSell}
          className="flex w-full h-[40.215px] justify-center items-center bg-[#b9554d] rounded-[4px] border-none relative z-40 pointer mt-[11.254px] mr-0 mb-0 "
        >
          <span className="flex w-full h-[40.215px] justify-center items-center shrink-0 font-['Inter'] text-[14px] font-medium leading-[20px] text-[#e7fbf0] relative text-center z-40">
            {t("배팅 상세페이지 주문 판매")}
          </span>
        </button>
      </div>
      {/* <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title={t("주문 확인")}
        description={`${optionsByOptionId?.content} - ${amount} points 판매하시겠습니까?`}
        confirmText={t("확인")}
        cancelText={t("취소")}
        onConfirm={handleSell}></ConfirmDialog> */}
    </>
  );
};

export default SellOrder;
