"use client";
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import BackButton from '@components/BackButton';
import Tabs from '@components/Tabs';
import SubscribePanel from '@components/SubscribePanel';
import PanelItem from '@ui/PanelItem';
import apiClient from '@api/axios'; // 예시 API 함수
import { usePathname } from "next/navigation";
 const fetchFollowers = async (path: string) => {
  const response = await apiClient.get(`/subscriptions/channel/${path}/subscribers?isUserChannel=true`);
  return response.data;
};

 const fetchFollowings = async (path: string) => {
  const response = await apiClient.get(`/subscriptions/user/${path}/following?isUserChannel=true`);
  return response.data;
};
const HomePage: React.FC = () => {
  const tabs = ['Followers', 'Followings'];
  const [activeTab, setActiveTab] = useState(0);
  const pathName = usePathname();
  const parts = pathName.split('/');
  const channelId = parts[2]; // "2" 추출

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  // Followers 탭에 대한 API 호출
  const { data: followersData, isLoading: followersLoading } = useQuery({

    queryKey:['followers', channelId], 
    queryFn:() => fetchFollowers(channelId), 
     enabled: activeTab === 0 ,
     staleTime: 1000 * 60 * 5,  // 5분 동안 데이터가 fresh 상태로 유지
    }
  );

  // Followings 탭에 대한 API 호출
  const { data: followingsData, isLoading: followingsLoading } = useQuery({
    queryKey:['followings', channelId], 
    queryFn:() => fetchFollowings(channelId), 
    enabled: activeTab === 1 
  }
  );

  return (
    <>
    
      <main className="relative col-span-5 w-full border-x border-slate-200">
        <div className="top-0 left-0 p-4 flex justify-start w-full">
          <BackButton />
        </div>
        <Tabs tabNames={tabs} onTabChange={handleTabChange} />

        {/* Followers 탭 */}
        {activeTab === 0 && (
          <SubscribePanel title="" href="/">
            {followersLoading ? (
              <div>Loading followers...</div>
            ) : (
              followersData.content.map((follower: any) => (
                <PanelItem
                  key={follower.userId}
                  id={follower.userId}
                  src={follower.userAvatarUrl}
                  name={follower.displayName}
                  username={follower.userName}
                  initials={follower.displayName}
                  isUserChannel={true}
                  following={follower.following}
                />
              ))
            )}
          </SubscribePanel>
        )}

        {/* Followings 탭 */}
        {activeTab === 1 && (
          <SubscribePanel title="" href="/">
            {followingsLoading ? (
              <div>Loading followings...</div>
            ) : (
              followingsData.content.map((following: any) => (
                <PanelItem
                  key={following.channelId}
                  id={following.channelId}
                  src={following.channelImageUrl}
                  name={following.displayName}
                  username={following.channelName}
                  initials={following.displayName}
                  isUserChannel={following.userChannel}
                  following={following.isFollowing}
                />
              ))
            )}
          </SubscribePanel>
        )}
      </main>
    </>
  );
};

export default HomePage;
