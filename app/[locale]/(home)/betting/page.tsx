"use client";

import Search from "@ui/Search";
import Panel from "@ui/Panel";
import PanelItemTrends from "@ui/PanelItemTrends";
import PanelItem from "@ui/PanelItem";
import Footer from "@ui/Footer";
import BettingProducts from "@ui/BettingProducts";
import GuideSection from "@ui/GuideSection";
import useUserStore from "@store/useUserStore";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import { PlusIcon } from "@heroicons/react/24/outline";

function BettingPage() {
  const { userInfo } = useUserStore((state) => ({
    userInfo: state.userInfo,
  }));
  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        <BettingProducts />
      </main>
      <aside className="col-span-3 hidden xl:flex flex-col w-[350px]">
        <div className="sticky top-0">
          <GuideSection />
        </div>
      </aside>
  
    </>
  );
}

export default BettingPage;
