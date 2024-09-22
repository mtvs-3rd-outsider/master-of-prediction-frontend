import { BettingActivityType } from "@/types/BettingActivityType";
import apiClient from "@handler/fetch/axios";
import * as Tabs from "@radix-ui/react-tabs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BettingActivity from "./BettingActivity";
import { BettingOptions } from "@/types/BettingTypes";
import { Select, SelectItem } from "@nextui-org/select";

interface Props {
  options: BettingOptions[] | [];
}

const animals = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "elephant", label: "Elephant" },
  { key: "lion", label: "Lion" },
  { key: "tiger", label: "Tiger" },
  { key: "giraffe", label: "Giraffe" },
  { key: "dolphin", label: "Dolphin" },
  { key: "penguin", label: "Penguin" },
  { key: "zebra", label: "Zebra" },
  { key: "shark", label: "Shark" },
  { key: "whale", label: "Whale" },
  { key: "otter", label: "Otter" },
  { key: "crocodile", label: "Crocodile" },
];

const BettingCommentActivityTabs = ({ options }: Props) => {
  const [activity, setActivity] = useState<BettingActivityType[]>([
    {},
  ] as BettingActivityType[]);
  const { id: bettingId } = useParams();
  const [selectChoiceOptionId, setSelectChoiceOptionId] = useState<number>();

  useEffect(() => {
    apiClient
      .get(`/betting-products/activity?bettingId=${bettingId}`)
      .then((res) => {
        setActivity(res.data);
      });
  }, [bettingId]);

  const handleSelectOptionChange = (e: any) => {
    setSelectChoiceOptionId(Number(e.target.value));
  };

  return (
    <Tabs.Root className="flex flex-col w-full " defaultValue="tab1">
      <Tabs.List className="shrink-0 flex " aria-label="Manage your account">
        <Tabs.Trigger
          className=" px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative  outline-none cursor-default"
          value="commant"
        >
          Comments
        </Tabs.Trigger>
        <Tabs.Trigger
          className=" px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative  outline-none cursor-default"
          value="activity"
        >
          Activity
        </Tabs.Trigger>
        <Tabs.Trigger
          className=" px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative  outline-none cursor-default"
          value="top-holders"
        >
          Top Holders
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="activity">
        <BettingActivity activity={activity} />
      </Tabs.Content>
      <Tabs.Content value="top-holders">
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
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default BettingCommentActivityTabs;
