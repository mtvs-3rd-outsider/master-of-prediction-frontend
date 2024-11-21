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
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

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

  return (
    <Tabs.Root className="flex flex-col w-full " defaultValue="tab1">
      <Tabs.List className="shrink-0 flex " aria-label="Manage your account">
        <Tabs.Trigger
          className=" px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative  outline-none cursor-default"
          value="commants"
        >
          {t("배팅 상세페이지 댓글")}
        </Tabs.Trigger>
        {!isBlind && (
          <>
            <Tabs.Trigger
              className=" px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative  outline-none cursor-default"
              value="activity"
            >
              {t("배팅 상세페이지 활동내역")}
            </Tabs.Trigger>
            <Tabs.Trigger
              className=" px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative  outline-none cursor-default"
              value="top-holders"
            >
              {t("배팅 상세페이지 구매 순위")}
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
