"use client";

import * as Tabs from "@radix-ui/react-tabs";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import BuyOrder from "./BuyOrder";
import SellOrder from "./SellOrder";
import useUserStore from "@store/useUserStore";
import { useEffect, useState } from "react";
import apiClient from "@handler/fetch/axios";
import { BettingOptions } from "@/types/BettingTypes";
import { BettingOptionChoiceStore } from "@/hooks/GlobalBettingOption";
import { useParams } from "next/navigation";
import { OrderHistoryType } from "@/types/BettingOrderType";
import Image from "next/image";

interface OrderFormProps {
  className?: string;
  options: BettingOptions[] | [];
}

export default function OrderForm({ className, options }: OrderFormProps) {
  // const userId = useUserStore.getState().userInfo?.id;
  const userId = 1;
  const [userPoint, setUserPoint] = useState<number>(0);
  const { optionId, setOptionId } = BettingOptionChoiceStore();
  const [orderHistory, setOrderHistory] = useState<OrderHistoryType[]>([]);
  const bettingId = useParams().id;
  const [optionsByOptionId, setOptionsByOptionId] = useState<BettingOptions>(
    {} as BettingOptions
  );
  const [choiceOptionhistory, setChoiceOptionHistory] =
    useState<OrderHistoryType>({} as OrderHistoryType);

  useEffect(() => {
    options.map((option) => {
      if (option.optionId == optionId) {
        setOptionsByOptionId(option);
      }
    });
  }, [optionId, options]);

  useEffect(() => {
    setChoiceOptionHistory({} as OrderHistoryType);
    orderHistory.map((history) => {
      if (history.bettingOptionId == optionId) {
        setChoiceOptionHistory(history);
      }
    });
  }, [optionId, orderHistory]);

  useEffect(() => {
    apiClient
      .get(`/user-point/${userId}`)
      .then((res) => setUserPoint(res.data));
    apiClient
      .get(`/user/betting-products?userId=${userId}&bettingId=${bettingId}`)
      .then((res) => {
        setOrderHistory(res.data);
      });
  }, [userId, bettingId]);

  return (
    <div
      className={`${className} flex flex-col w-full shadow-[0_2px_10px] shadow-blackA2`}
    >
      <div className="flex gap-4 py-4 px-4 ">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          {optionsByOptionId?.imgUrl && (
            <Image
              alt=""
              layout="responsive"
              width={100}
              height={60}
              src={`${optionsByOptionId?.imgUrl}`}
              className="h-full w-full object-cover object-center"
            />
          )}
        </div>
        <div className="flex justify-center items-center">
          <p>{optionsByOptionId?.content}</p>
        </div>
      </div>
      <Tabs.Root className="" defaultValue="tab1">
        <Tabs.List
          className="shrink-0 flex border-b border-mauve6"
          aria-label="Manage your account"
        >
          <Tabs.Trigger
            className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11  data-[state=active]:shadow-current data-[state=active]:focus:relative   outline-none cursor-default data-[state=active]:bg-[#00632b] data-[state=inactive]:text-green-600  data-[state=active]:text-white"
            value="tab1"
          >
            Buy
          </Tabs.Trigger>
          <Tabs.Trigger
            className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11  data-[state=active]:shadow-current data-[state=active]:focus:relative  outline-none cursor-default data-[state=active]:bg-[#b9554d] data-[state=inactive]:text-red-500 data-[state=active]:text-white"
            value="tab2"
          >
            Sell
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          className="grow p-5 bg-white rounded-b-md outline-none  "
          value="tab1"
        >
          <BuyOrder
            userPoint={userPoint}
            setUserPoint={setUserPoint}
            options={options}
            setOrderHistory={setOrderHistory}
            optionsByOptionId={optionsByOptionId}
            choiceOptionhistory={choiceOptionhistory}
          />
        </Tabs.Content>
        <Tabs.Content
          className="grow p-5 bg-white rounded-b-md outline-none "
          value="tab2"
        >
          <SellOrder
            userPoint={userPoint}
            setUserPoint={setUserPoint}
            options={options}
            orderHistory={orderHistory}
            setOrderHistory={setOrderHistory}
            optionsByOptionId={optionsByOptionId}
            choiceOptionhistory={choiceOptionhistory}
          />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
