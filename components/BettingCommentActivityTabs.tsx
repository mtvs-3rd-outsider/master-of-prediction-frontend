import {
  BettingActivityType,
  BettingTopHolders,
} from "@/types/BettingActivityType";
import apiClient from "@handler/fetch/axios";
import * as Tabs from "@radix-ui/react-tabs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BettingActivity from "./BettingActivity";
import { BettingOptions } from "@/types/BettingTypes";
import { Select, SelectItem } from "@nextui-org/select";
import BettingAccount from "./BettingAccount";
import BettingTopHolers from "./BettingTopHolers";
import BettingComments from "./BettingComments";

interface Props {
  options: BettingOptions[] | [];
  isBlind: boolean;
}

const BettingCommentActivityTabs = ({ options, isBlind }: Props) => {
  const [activity, setActivity] = useState<BettingActivityType[]>([
    {},
  ] as BettingActivityType[]);
  const [topHolders, setTopHolders] = useState<BettingTopHolders>(
    {} as BettingTopHolders
  );
  const { id: bettingId } = useParams();

  useEffect(() => {
    apiClient
      .get(`/betting-products/activity?bettingId=${bettingId}`)
      .then((res) => {
        setActivity(res.data);
      });
  }, [bettingId]);

  useEffect(() => {
    apiClient
      .get(`/betting-products/top-holders?bettingId=${bettingId}`)
      .then((res) => {
        setTopHolders(res.data);
      });
  }, [bettingId]);

  console.log("isBlind: ", isBlind);

  return (
    <Tabs.Root className="flex flex-col w-full " defaultValue="tab1">
      <Tabs.List className="shrink-0 flex " aria-label="Manage your account">
        <Tabs.Trigger
          className=" px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative  outline-none cursor-default"
          value="commants"
        >
          Comments
        </Tabs.Trigger>
        {!isBlind && (
          <>
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
          </>
        )}
      </Tabs.List>
      <Tabs.Content value="commants">
        <BettingComments />
      </Tabs.Content>
      <Tabs.Content value="activity">
        <BettingActivity activity={activity} />
      </Tabs.Content>
      <Tabs.Content value="top-holders">
        <BettingTopHolers options={options} topHolders={topHolders} />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default BettingCommentActivityTabs;
