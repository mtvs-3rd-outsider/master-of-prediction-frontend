"use client";

import BettingProducts from "@ui/BettingProducts";
import GuideSection from "@ui/GuideSection";

function BettingPage() {
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
