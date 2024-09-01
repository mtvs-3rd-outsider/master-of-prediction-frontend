// pages/login.js
"use client";
import Head from "next/head";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { NextApiRequest, NextApiResponse } from "next";
import Header from "@ui/Header";
import Search from "@ui/Search";
import Panel from "@ui/Panel";
import PanelItemTrends from "@ui/PanelItemTrends";
import PanelItem from "@ui/PanelItem";
import Footer from "@ui/Footer";
import BettingProducts from "@ui/BettingProducts";
import OrderForm from "@ui/OrderForm";
import BettingProductsChatRoom from "@ui/BettnigProductsChatRoom";
function BettingDetailPage() {
  console.log("TEST");
  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        <Header title="Betting Details" />

        {/* <Feed /> */}
        <BettingProducts />
      </main>
      <aside className="col-span-3 hidden xl:flex flex-col w-[350px]">
        <div className="sticky top-0">
          <Search />
          <OrderForm />
          <BettingProductsChatRoom />
          {/* <Panel title="Who to follow" href="/">
            <PanelItem
              src="https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8Mjd8NzkwMjQ2NTJ8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60"
              name="Charles Deluvio"
              username="charlesdeluvio"
              initials="CD"
            />
            <PanelItem
              src="https://images.unsplash.com/photo-1613951085587-cfe5d0a6cffc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTZ8NzkwMjQ2NTJ8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60"
              name="Tolga Ulkan"
              username="tolgaulkan"
              initials="TU"
            />
            <PanelItem
              src="https://images.unsplash.com/photo-1614777735430-7b46df56b404?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw3OTAyNDY1Mnx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
              name="Rob Potter"
              username="robpotter"
              initials="RB"
            />
          </Panel> */}
          <Footer />
        </div>
      </aside>
    </>
  );
}

export default BettingDetailPage;
