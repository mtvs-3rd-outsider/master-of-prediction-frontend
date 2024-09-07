"use client";

import { Suspense } from "react";
import { Skeleton } from "@nextui-org/skeleton";
import BettingProduct from "./BettingProduct";

const BettingProducts = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <ul className="[&_p:last-child]:text-slate-500 [&_p:first-child]:text-lg divide-y divide-slate-200">
          <li>
            <BettingProduct />
          </li>
          <li>
            <BettingProduct />
          </li>
          <li>
            <BettingProduct />
          </li>
          <li>
            <BettingProduct />
          </li>
          <li>
            <BettingProduct />
          </li>
          <li>
            <BettingProduct />
          </li>
          <li>
            <BettingProduct />
          </li>
          <li>
            <BettingProduct />
          </li>
          <li>
            <BettingProduct />
          </li>
          <li>
            <BettingProduct />
          </li>
          <li>
            <BettingProduct />
          </li>
          <li>
            <BettingProduct />
          </li>
          <li>
            <BettingProduct />
          </li>
          <li>
            <BettingProduct />
          </li>
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
