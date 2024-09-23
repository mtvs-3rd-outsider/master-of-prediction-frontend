"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { Skeleton } from "@nextui-org/skeleton";
import BettingProduct from "./BettingProduct";
import apiClient from "@handler/fetch/axios";
import { BettingProductType } from "@/types/BettingTypes";

const BettingProducts = () => {
  const [bettings, setBettings] = useState<BettingProductType[]>([]);
  // const [offset, setOffset] = useState(0);

  const getBettings = useCallback(async () => {
    const response = await apiClient.get("/betting-products");
    setBettings(response.data);
    // setOffset(offset + 10);
    // }, [offset]);
  }, []);

  useEffect(() => {
    getBettings();
  }, [getBettings]);
  return (
    <>
      <Suspense fallback={<Loading />}>
        <ul className="[&_p:last-child]:text-slate-500 [&_p:first-child]:text-lg divide-y divide-slate-200">
          {bettings.map((node, i) => (
            <li key={node.bettingId}>
              <BettingProduct
                userID={node.userID}
                userName={node.userName}
                displayName={node.displayName}
                tierName={node.tierName}
                userImg={node.userImg}
                title={node.title}
                imgUrls={node.imgUrls}
                bettingId={node.bettingId}
              />
            </li>
          ))}
        </ul>
      </Suspense>
      <div></div>
    </>
  );
};

export default BettingProducts;

const Loading = () => {
  return (
    <Suspense fallback={<div>Loading skeleton...</div>}>
      <Skeleton className="rounded-lg">
        <div className="h-24 rounded-lg bg-default-300"></div>
      </Skeleton>
    </Suspense>
  );
};
