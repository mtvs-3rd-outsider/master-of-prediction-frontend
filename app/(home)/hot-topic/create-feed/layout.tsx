import React from 'react';
import Search from '@ui/Search';
import Panel from '@ui/Panel';
import PanelItem from '@ui/PanelItem';
import PanelItemTrends from '@ui/PanelItemTrends';
import Footer from '@ui/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        {children}
      </main>
      
    </>
  );
}
