"use client";

import * as Tabs from "@radix-ui/react-tabs";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import BuyOrder from "./BuyOrder";
import SellOrder from "./SellOrder";

interface OrderFormProps {
  className?: string;
}

export default function OrderForm({ className }: OrderFormProps) {
  return (
    <div className={className}>
      <Tabs.Root
        className="flex flex-col w-full shadow-[0_2px_10px] shadow-blackA2"
        defaultValue="tab1"
      >
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
          <BuyOrder />
        </Tabs.Content>
        <Tabs.Content
          className="grow p-5 bg-white rounded-b-md outline-none "
          value="tab2"
        >
          <SellOrder />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
