"use client";

import Search from "@ui/Search";
import Footer from "@ui/Footer";
import BettingProductDetail from "@ui/BettingProductsDetail";
import OrderForm from "@ui/OrderForm";
import BettingProductsChatRoom from "@ui/BettnigProductsChatRoom";
function BettingDetailPage() {
  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        <BettingProductDetail />
      </main>
      <aside className="col-span-3 hidden xl:flex flex-col w-[350px]">
        <div className="sticky top-0">
          <Search />
          <OrderForm />
          <BettingProductsChatRoom />
          <Footer />
        </div>
      </aside>
    </>
  );
}

export default BettingDetailPage;
