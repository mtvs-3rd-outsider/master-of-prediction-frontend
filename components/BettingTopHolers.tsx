"use client";

import { BettingOptions } from "@/types/BettingTypes";
import { Select, SelectItem } from "@nextui-org/select";
import { useState } from "react";
import BettingAccount from "./BettingAccount";
import { BettingTopHolders } from "@/types/BettingActivityType";

interface Props {
  options: BettingOptions[] | [];
  topHolders: BettingTopHolders;
}

const BettingTopHolers = ({ options, topHolders }: Props) => {
  const [selectChoiceOptionId, setSelectChoiceOptionId] = useState<number>(
    options[0].optionId
  );

  const handleSelectOptionChange = (e: any) => {
    setSelectChoiceOptionId(Number(e.target.value));
  };
  console.log("select: ", selectChoiceOptionId);
  return (
    <>
      <>
        <Select
          aria-label="옵션 선택"
          placeholder="Select an option"
          defaultSelectedKeys={[options[0]?.optionId.toString()]}
          className="max-w-xs"
          scrollShadowProps={{
            isEnabled: false,
          }}
          onChange={handleSelectOptionChange}
          classNames={{
            trigger: "py-4 mt-6",
          }}
        >
          {options.map((option) => (
            <SelectItem key={option.optionId.toString()}>
              {option.content}
            </SelectItem>
          ))}
        </Select>
      </>
      {Object.keys(topHolders)
        .filter((key) => key === selectChoiceOptionId?.toString()) // 선택된 키만 필터링
        .map((bettingOptionId) => {
          const holders = topHolders[Number(bettingOptionId)];
          return (
            <div key={bettingOptionId}>
              <ul>
                {holders.map((holder, index) => (
                  <li
                    key={index}
                    className="flex justify-between px-4 py-4 shadow "
                  >
                    <BettingAccount
                      userName={holder.userName}
                      displayName={holder.displayName ?? ""}
                      tier={holder.tierName}
                      avatarUrl={holder.userImg ?? ""}
                    />

                    <span>{holder.point}p</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
    </>
  );
};

export default BettingTopHolers;
