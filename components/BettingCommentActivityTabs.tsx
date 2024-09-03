import * as Tabs from "@radix-ui/react-tabs";

const BettingCommentActivityTabs = () => {
  return (
    <Tabs.Root className="flex flex-col w-full " defaultValue="tab1">
      <Tabs.List className="shrink-0 flex " aria-label="Manage your account">
        <Tabs.Trigger
          className=" px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative  outline-none cursor-default"
          value="commant"
        >
          댓글
        </Tabs.Trigger>
        <Tabs.Trigger
          className=" px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative  outline-none cursor-default"
          value="activity"
        >
          활동내역
        </Tabs.Trigger>
        <Tabs.Trigger
          className=" px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative  outline-none cursor-default"
          value="rank"
        >
          랭크
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
};

export default BettingCommentActivityTabs;
