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
      {!userInfo ? null : (
        <div className="fixed bottom-20 right-4 md:bottom-4">
          <Link href={"/betting/add"}>
            <Button
              isIconOnly
              color="primary"
              aria-label="Add"
              className="rounded-full p-3 shadow-lg"
            >
              <PlusIcon className="h-8 w-8" />
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}

export default BettingPage;
