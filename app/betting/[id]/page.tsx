"use client";

import Search from "@ui/Search";
import Footer from "@ui/Footer";
import BettingProductDetail from "@ui/BettingProductsDetail";
import OrderForm from "@ui/OrderForm";
import BettingProductsChatRoom from "@ui/BettnigProductsChatRoom";
import { useEffect, useState } from "react";
import apiClient from "@handler/fetch/axios";
import { useParams } from "next/navigation";
import {
  BettingCreater,
  BettingOptions,
  BettingProduct,
  BettingProductInfo,
  OptionsRatio,
} from "@/types/BettingTypes";

function BettingDetailPage() {
  // 배팅 정보를 불러와서 각 노드에 전달
  const params = useParams();
  const [bettingInfo, setBettingInfo] = useState<BettingProductInfo>();
  const [optionsRatio, setOptionsRatio] = useState<OptionsRatio[]>(
    [] as OptionsRatio[]
  );

  useEffect(() => {
    apiClient(`betting-products/${params.id}`).then((res) => {
      setBettingInfo(res.data);
    });

    apiClient(`/betting-products/options/ratio?bettingId=${params.id}`).then(
      (res) => {
        setOptionsRatio(res.data);
      }
    );
  }, [params.id]);

  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        <BettingProductDetail
          user={bettingInfo?.user || ({} as BettingCreater)}
          product={bettingInfo?.product || ({} as BettingProduct)}
          options={bettingInfo?.options || []}
          productImages={bettingInfo?.productImages || []}
          optionsRatio={optionsRatio}
        />
        {/* TODO: 작은 화면일때 주문 디자인 추가 */}
        {/* <OrderForm className="xl:hidden mx-auto" /> */}
      </main>
      <aside className="col-span-3 hidden xl:flex flex-col w-[350px]">
        <div className="sticky top-0">
          <Search />
          <OrderForm options={bettingInfo?.options || []} />
          <BettingProductsChatRoom />
          <Footer />
        </div>
      </aside>
    </>
  );
}

export default BettingDetailPage;
