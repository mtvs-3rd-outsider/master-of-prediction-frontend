"use client";

import Search from "@ui/Search";
import Footer from "@ui/Footer";
import BettingProductDetail from "@ui/BettingProductsDetail";
import OrderForm from "@ui/OrderForm";
import BettingProductsChatRoom from "@ui/BettnigProductsChatRoom";
function BettingDetailPage() {
  // 배팅 정보를 불러와서 각 노드에 전달
  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        <BettingProductDetail />
        {/* TODO: 작은 화면일때 주문 디자인 추가 */}
        {/* <OrderForm className="xl:hidden mx-auto" /> */}
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
