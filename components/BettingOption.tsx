"use client";

import { BettingOptionChoiceStore } from "@/hooks/GlobalBettingOption";
import { BettingOrderStatisticsDTO } from "@/types/BettingOrderHistoryData";
import { BettingOptions, OptionsRatio } from "@/types/BettingTypes";
import Image from "next/image";
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
  const [state, setState] = useState(false);
  const { optionId, setOptionId } = BettingOptionChoiceStore();
  const [optionRatio, setOptionRatio] = useState<number>(0);

  const handleClick = () => {
    setState(!state);
    setOptionId(currentOptionId);
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
              layout="responsive"
              width={100}
              height={60}
              src={`${imgUrl}`}
              className="h-full w-full object-cover object-center"
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
      {/* <div style={{ width: "300px", height: "300px" }}> */}
      {state && (
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="90%">
            <LineChart
              data={data}
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
          <div className="flex gap-4 h-auto">
            <button className="rounded-lg hover:bg-gray-400 px-4">1H</button>
            <button className="rounded-lg hover:bg-gray-400 px-4">6H</button>
            <button className="rounded-lg hover:bg-gray-400 px-4">1D</button>
            <button className="rounded-lg hover:bg-gray-400 px-4">1W</button>
            <button className="rounded-lg hover:bg-gray-400 px-4">1M</button>
            <button className="rounded-lg hover:bg-gray-400 px-4">ALL</button>
          </div>
        </div>
      )}
    </>
  );
};

export default BettingOption;
