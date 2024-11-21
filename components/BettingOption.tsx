"use client";

import BettingGraphFilterConstants from "@/constant/BettingGraphFilterConstants";
import { BettingOptionChoiceStore } from "@/hooks/GlobalBettingOption";
import {
  BettingOrderHistoryData,
  BettingOrderHistoryDataArray,
  BettingOrderStatisticsDTO,
} from "@/types/BettingOrderHistoryData";
import { BettingOptions, OptionsRatio } from "@/types/BettingTypes";
import apiClient from "@handler/fetch/axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

interface Props {
  content: string;
  imgUrl: string;
  currentOptionId: number;
  ratio?: OptionsRatio;
  data?: BettingOrderStatisticsDTO[];
  winningOption?: number | null;
}
interface CustomPayload {
  orderTime: string;
  ratio: number;
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    // payload[0].payload에서 값을 가져와 사용
    const { orderTime, ratio } = payload[0].payload as CustomPayload;

    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p className="label">{orderTime}</p>
        <p className="intro">{ratio}%</p>
      </div>
    );
  }

  return null;
};

const BettingOption = ({
  content,
  imgUrl,
  currentOptionId,
  ratio,
  data,
  winningOption,
}: Props) => {
  const FILTER_1H = "1H";
  const FILTER_6H = "6H";
  const FILTER_1D = "1D";
  const FILTER_1W = "1W";
  const FILTER_1M = "1M";
  const FILTER_ALL = "ALL";
  const FILTER_OPTIONS = [
    FILTER_1H,
    FILTER_6H,
    FILTER_1D,
    FILTER_1W,
    FILTER_1M,
    FILTER_ALL,
  ];

  const [bettingOrderHistoryData, setBettingOrderHistoryData] =
    useState<BettingOrderHistoryData>({
      lastHour: [],
      last6Hour: [],
      oneDay: [],
      oneWeek: [],
      oneMonth: [],
      all: [],
    });
  const [state, setState] = useState(false);
  const { optionId, setOptionId } = BettingOptionChoiceStore();
  const [optionRatio, setOptionRatio] = useState<number>(0);
  const [cachedData, setCachedData] = useState({});
  const [currentData, setCurrentData] = useState<BettingOrderStatisticsDTO[]>();
  const [selectedFilter, setSelectedFilter] = useState(FILTER_ALL);
  const bettingId = useParams().id;

  useEffect(() => {
    setBettingOrderHistoryData((prevData) => ({
      ...prevData,
      all: data != undefined ? data : [], // 'all' 필드 업데이트
    }));
    setCurrentData(data);
  }, [data]);

  const handleClick = () => {
    setState(!state);
    setOptionId(currentOptionId);
  };

  useEffect(() => {
    // 필터링된 데이터를 가져오는 함수
    apiClient
      .get<BettingOrderHistoryDataArray>(
        `/betting-products/orders?bettingId=${bettingId}&timeRange=${BettingGraphFilterConstants[selectedFilter]}`
      )
      .then((res) => {
        setBettingOrderHistoryData((prevData) => ({
          ...prevData,
          [BettingGraphFilterConstants[selectedFilter]]:
            res.data != undefined && res.data != null
              ? res.data[`${currentOptionId}`]
              : [],
        }));
        setCurrentData(res.data[`${currentOptionId}`]);
      });
  }, [selectedFilter, bettingId, currentOptionId]);

  const handleButtonClick = (filter: string) => {
    setSelectedFilter(filter);
  };

  useEffect(() => {
    if (optionId !== currentOptionId) {
      setState(false);
    }
  }, [optionId, currentOptionId]);

  const uniqueDates = useMemo(() => {
    const dateSet = new Set();
    return (
      data &&
      data
        .filter((item) => {
          if (!dateSet.has(item.orderDate)) {
            dateSet.add(item.orderDate);
            return true;
          }
          return false;
        })
        .map((item) => item.orderDate)
    );
  }, [data]);

  useEffect(() => {
    setOptionRatio(data ? data[data?.length - 1]?.ratio : 0);
  }, [data]);

  return (
    <>
      <li
        className={`flex gap-4 py-6
			rounded-lg shadow-lg p-6 transform transition-transform duration-300 ease-in-out hover:bg-gray-200 hover:shadow-xl
          ${winningOption == currentOptionId && "bg-green-400"}
      `}
        onClick={handleClick}
      >
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          {imgUrl && (
            <Image
              alt=""
              width={100}
              height={100}
              objectFit="fill"
              src={`${imgUrl}`}
              className="rounded-md h-full"
            />
          )}
        </div>
        <div className="flex-1 m-auto">
          <p>{content}</p>
        </div>
        <div className="flex-1 flex items-center">
          <p>{ratio === undefined ? "0" : ratio.totalPoints}p</p>
        </div>
        <div className="flex-1 flex items-center">
          <p>{optionRatio}%</p>
        </div>
      </li>
      {state && (
        <div className="w-full h-72 py-4 sm:py-8">
          <ResponsiveContainer width="100%" height="90%">
            <LineChart
              data={currentData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={3} />
              <XAxis
                axisLine={false}
                dataKey="orderDate"
                tickLine={false}
                hide={false}
                interval={0}
                ticks={uniqueDates}
              />
              <YAxis hide={false} axisLine={false} tickLine={true} />
              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey="ratio"
                stroke="#8884d8"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-2 h-auto">
            {FILTER_OPTIONS.map((filter) => (
              <button
                key={filter}
                className={`rounded-lg ${
                  filter !== selectedFilter && "hover:bg-gray-200"
                } px-4
                ${filter === selectedFilter && "bg-black text-white"} `}
                onClick={() => handleButtonClick(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default BettingOption;
