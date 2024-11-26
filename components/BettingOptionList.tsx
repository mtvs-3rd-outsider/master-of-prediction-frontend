"use client";

import { BettingOptions, OptionsRatio } from "@/types/BettingTypes";
import BettingOption from "./BettingOption";
import { useEffect, useState } from "react";
import { BettingOrderStatisticsDTO } from "@/types/BettingOrderHistoryData";
import apiClient from "@handler/fetch/axios";
import { useParams } from "next/navigation";
import BettingGraphFilterConstants from "@/constant/BettingGraphFilterConstants";
import { useTranslations } from "next-intl";

interface Props {
  options: BettingOptions[] | [];
  optionsRatio: OptionsRatio[] | [];
  winningOption?: number | null;
}

interface BettingOrderHistoryDataProps {
  [key: string]: BettingOrderStatisticsDTO[];
}

const removeDuplicateOrderDates = (
  data: BettingOrderStatisticsDTO[]
): BettingOrderStatisticsDTO[] => {
  const seenOrderDates = new Set<string>();

  return data.map((item) => {
    if (seenOrderDates.has(item.orderDate)) {
      return { ...item, orderDate: "" };
    } else {
      seenOrderDates.add(item.orderDate);
      return item;
    }
  });
};
const BettingOptionList = ({ options, optionsRatio, winningOption }: Props) => {
  const t = useTranslations();
  const [optionDatas, setOptionDatas] =
    useState<BettingOrderHistoryDataProps | null>(null);
  const bettingId = useParams().id;

  useEffect(() => {
    apiClient
      .get<BettingOrderHistoryDataProps>(
        `/betting-products/orders?bettingId=${bettingId}&timeRange=${BettingGraphFilterConstants.ALL}`
      )
      .then((res) => {
        setOptionDatas(res.data);
      });
  }, [bettingId]);

  // 이벤트 등록 후 재 계산 필요, 만약 1분이 넘는다면 다시 요청

  return (
    <>
      {/* TODO: 다국어 처리 */}
      {/* <div className="flex py-4 shadow justify-around px-8"> */}
      <div
        className="flex gap-4 py-6
			 p-6 transform transition-transform duration-300 ease-in-out"
      >
        <div className="h-4 w-20 "></div>
        <div className="flex-1 m-auto">
          <p>{t("배팅 상세페이지 옵션내용 설명")}</p>
        </div>
        <div className="flex-1 flex items-center">
          <p>{t("배팅 상세페이지 옵션내용 포인트")}</p>
        </div>
        <div className="flex-1 flex items-center">
          <p>{t("배팅 상세페이지 옵션내용 비율")}</p>
        </div>
      </div>
      {/* </div> */}
      {/* </div> */}
      <ul role="list" className=" divide-y divide-gray-200">
        {options.map((option) => {
          // optionsRatio에서 option.optionId와 일치하는 항목 찾기
          const matchingRatio = optionsRatio.find(
            (ratio) => ratio.bettingOptionId === option.optionId
          );

          return (
            <>
              <BettingOption
                key={option.optionId}
                content={option.content}
                imgUrl={option.imgUrl}
                currentOptionId={option.optionId}
                ratio={matchingRatio}
                data={
                  optionDatas != undefined && optionDatas != null
                    ? optionDatas[`${option.optionId}`]
                    : []
                }
                winningOption={winningOption}
              />
            </>
          ); // matchingRatio가 없으면 null을 반환
        })}

        {/* <BettingOption data={option_data2} /> */}
      </ul>
    </>
  );
};

export default BettingOptionList;
