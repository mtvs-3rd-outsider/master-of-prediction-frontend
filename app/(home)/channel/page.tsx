import React from 'react';
import Tabs from '@components/StickyTabs';
import Search from '@ui/Search';
import Panel from '@ui/Panel';
import PanelItem from '@ui/PanelItem';
import PanelItemTrends from '@ui/PanelItemTrends';
import Footer from '@ui/Footer';
import MyChannel from '@components/MyChannel';
import { redirect } from 'next/navigation';

 function ChannelPage() {
  redirect('/channel/1'); // 리디렉션을 설정

  return null; // 이 페이지는 렌더링되지 않습니다.
}
export default ChannelPage;
