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
      <aside className="col-span-3 hidden xl:flex flex-col w-[350px]">
        <div className="sticky top-0">
          <Search />
          <Panel title="What's happening" href="/">
            <PanelItemTrends title="Next JS" category="Development" stat="57.5K" />
            <PanelItemTrends title="Figma" category="Design" stat="107.5K" />
            <PanelItemTrends title="Webflow" category="Design" stat="127.5K" />
            <PanelItemTrends title="Tailwind CSS" category="Development" stat="87.5K" />
            <PanelItemTrends title="Vercel" category="Development" stat="27.5K" />
          </Panel>
          <Panel title="Who to follow" href="/">
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
          </Panel>
          <Footer />
        </div>
      </aside>
    </>
  );
}
