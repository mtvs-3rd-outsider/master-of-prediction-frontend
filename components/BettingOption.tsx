import { BettingOptionChoiseStore } from "@/hooks/GlobalBettingOption";
import { BettingOptions } from "@/types/BettingTypes";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  content: string;
  imgUrl: string;
  currentOptionId: number;
}

const BettingOption = ({ content, imgUrl, currentOptionId }: Props) => {
  const [state, setState] = useState(false);
  const { optionId, setOptionId } = BettingOptionChoiseStore();

  const handleClick = () => {
    setState(!state);
    setOptionId(currentOptionId);
  };

  useEffect(() => {
    setState(false);
    if (optionId === currentOptionId) {
      setState(true);
    }
  }, [optionId, currentOptionId]);

  return (
    <>
      <li
        className="flex gap-4 py-6
			rounded-lg shadow-lg p-6 transform transition-transform duration-300 ease-in-out hover:bg-gray-200 hover:shadow-xl
			"
        onClick={handleClick}
      >
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${imgUrl}`}
            alt=""
            className="h-full w-full object-cover object-center"
            width={500}
            height={500}
          />
        </div>
        <div className="flex-1 m-auto">
          <p>{content}</p>
        </div>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              // data={data.chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0} />
              {/* <XAxis dataKey="name" hide={true} />
              <YAxis hide={true} /> */}
              {/* <Tooltip /> */}
              {/* <Legend /> */}
              <Line type="monotone" dataKey="pv" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 flex items-center">
          <p>2,509.75</p>
        </div>
      </li>
      {/* <div style={{ width: "300px", height: "300px" }}> */}
      {state && (
        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              // data={data.chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0} />
              <XAxis dataKey="name" hide={false} />
              <YAxis hide={false} />
              <Tooltip />
              {/* <Legend /> */}
              <Line type="monotone" dataKey="pv" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default BettingOption;
