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
  PostStatsNavState,
} from "@/types/BettingTypes";
import { BettingOptionChoiceStore } from "@/hooks/GlobalBettingOption";
import NotFound from "@/app/not-found";

function BettingDetailPage() {
  // 배팅 정보를 불러와서 각 노드에 전달
  const params = useParams();
  const [bettingInfo, setBettingInfo] = useState<BettingProductInfo>();
  const [optionsRatio, setOptionsRatio] = useState<OptionsRatio[]>(
    [] as OptionsRatio[]
  );
  const [isNotFound, setIsNotFound] = useState(false);
  const { setOptionId } = BettingOptionChoiceStore();

  useEffect(() => {
    apiClient(`betting-products/${params.id}`)
      .then((res) => {
        const bettingInfo = res.data;
        const bettingId = [Number(params.id) * -1];
        console.log("bettingId: ", bettingId);
        apiClient
          .get(`/feeds/betting?ids=${bettingId}`)
          .then((response_feeds) => {
            bettingInfo.postStats = response_feeds.data[0];
            setBettingInfo(bettingInfo);
            setOptionId(res.data?.options[0]?.optionId);
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              setIsNotFound(true);
            }
          });
        // setBettingInfo(res.data);
        // setOptionId(res.data?.options[0]?.optionId);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setIsNotFound(true);
        }
      });

    apiClient(`/betting-products/options/ratio?bettingId=${params.id}`).then(
      (res) => {
        setOptionsRatio(res.data);
      }
    );
  }, [params.id, setOptionId]);

  return (
    <>
      {isNotFound && NotFound()}
      {!isNotFound && (
        <>
          <main className="col-span-5 w-full border-x border-slate-200">
            <BettingProductDetail
              user={bettingInfo?.user || ({} as BettingCreater)}
              product={bettingInfo?.product || ({} as BettingProduct)}
              options={bettingInfo?.options || []}
              productImages={bettingInfo?.productImages || []}
              optionsRatio={optionsRatio}
              postStats={bettingInfo?.postStats || ({} as PostStatsNavState)}
            />
            <OrderForm
              options={bettingInfo?.options || []}
              className="xl:hidden"
            />
            {/* TODO: 작은 화면일때 주문 디자인 추가 */}
            {/* <OrderForm className="xl:hidden mx-auto" /> */}
          </main>
          <aside className="col-span-3 hidden xl:flex flex-col w-[350px]">
            <div className="sticky top-0">
              {/* <Search /> */}
              <OrderForm options={bettingInfo?.options || []} />
              <BettingProductsChatRoom id={params.id as string} />
              {/* <Footer /> */}
            </div>
          </aside>
        </>
      )}
    </>
  );
}

export default BettingDetailPage;
