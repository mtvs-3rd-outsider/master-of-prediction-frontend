"use client";

import { BettingOptions, OptionsRatio } from "@/types/BettingTypes";
import BettingOption from "./BettingOption";
import { useEffect, useState } from "react";
import { BettingOrderStatisticsDTO } from "@/types/BettingOrderHistoryData";
import apiClient from "@handler/fetch/axios";
import { useParams } from "next/navigation";

interface Props {
  options: BettingOptions[] | [];
  optionsRatio: OptionsRatio[] | [];
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
const BettingOptionList = ({ options, optionsRatio }: Props) => {
  const [optionDatas, setOptionDatas] =
    useState<BettingOrderHistoryDataProps | null>(null);
  const bettingId = useParams().id;

  useEffect(() => {
    apiClient
      .get<BettingOrderHistoryDataProps>(
        `/betting-products/orders?bettingId=${bettingId}`
      )
      .then((res) => {
        // const processedData: BettingOrderHistoryDataProps = {};
        // for (const [key, value] of Object.entries(res.data)) {
        //   processedData[key] = removeDuplicateOrderDates(value);
        // }
        // console.log("processData: ", processedData);
        // setOptionDatas(processedData);
        setOptionDatas(res.data);
      });
  }, [bettingId]);

  return (
    <>
      <div className="flex py-4 shadow justify-around px-8">
        <span className="text-lg font-bold">content</span>
        <span className="text-lg font-bold">totalPoints</span>
        <span className="text-lg font-bold">Ratio</span>
      </div>
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

// 데이터 예시
// const option_data1 = {
//   title: "트럼프",
//   imgSrc:
//     "data:image/jpeg;base64,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",
//   chartData: [
//     {
//       name: "page1",
//       pv: 24,
//     },
//     {
//       name: "page2",
//       pv: 13,
//     },
//     {
//       name: "page3",
//       pv: 98,
//     },
//     {
//       name: "page4",
//       pv: 39,
//     },
//     {
//       name: "page5",
//       pv: 48,
//     },
//     {
//       name: "page6",
//       pv: 38,
//     },
//     {
//       name: "page7",
//       pv: 43,
//     },
//   ],
// };
