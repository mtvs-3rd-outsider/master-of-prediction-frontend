"use client";
import React, { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import BackButton from "@components/BackButton";
import Tabs from "@components/Tabs";
import SubscribePanel from "@components/SubscribePanel";
import PanelItem from "@ui/PanelItem";
import apiClient from "@api/axios";
import { usePathname } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { fetchFollowers, fetchFollowings } from "@handler/followApi";


const HomePage: React.FC = () => {
  const tabs = ["Followers", "Followings"];
  const [activeTab, setActiveTab] = useState(0);
  const pathName = usePathname();
  const parts = pathName.split("/");
  const channelId = parts[parts.length - 2];
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  // Infinite Query for followers
  const {
    data: followersData,
    isLoading: followersLoading,
    fetchNextPage: fetchNextFollowers,
    hasNextPage: hasNextFollowers,
    isFetchingNextPage: isFetchingNextFollowers,
  } = useInfiniteQuery({
    queryKey: ["followers", channelId],
    queryFn: ({ pageParam = 1, queryKey }) =>
      fetchFollowers(pageParam, queryKey),
    getNextPageParam: (lastPage) => {
      return !lastPage.last ? lastPage.number + 1 : undefined;
    },
    initialPageParam: 0,
    enabled: activeTab === 0,
  });

  // Infinite Query for followings
  const {
    data: followingsData,
    isLoading: followingsLoading,
    fetchNextPage: fetchNextFollowings,
    hasNextPage: hasNextFollowings,
    isFetchingNextPage: isFetchingNextFollowings,
  } = useInfiniteQuery({
    queryKey: ["followings", channelId],
    queryFn: ({ pageParam = 1, queryKey }) =>
      fetchFollowings(pageParam, queryKey),
    getNextPageParam: (lastPage) => {
      return !lastPage.last ? lastPage.number + 1 : undefined;
    },
    initialPageParam: 0,
    enabled: activeTab === 1,
  });

  useEffect(() => {
    if (isInView) {
      if (activeTab === 0 && hasNextFollowers) {
        fetchNextFollowers();
      } else if (activeTab === 1 && hasNextFollowings) {
        fetchNextFollowings();
      }
    }
  }, [
    isInView,
    activeTab,
    hasNextFollowers,
    hasNextFollowings,
    fetchNextFollowers,
    fetchNextFollowings,
  ]);

  return (
    <>
      <main className="relative col-span-5 w-full border-x border-slate-200">
        <div className=" top-0 left-0 p-4 flex justify-start w-full">
          <BackButton />
        </div>
        <Tabs tabNames={tabs} onTabChange={handleTabChange} />

        {/* Followers Tab */}
        {activeTab === 0 && (
          <SubscribePanel title="" href="/">
            {followersLoading ? (
              <div>Loading followers...</div>
            ) : followersData?.pages[0]?.content.length === 0 ? ( // 체크: followers가 없는 경우
              <div className="flex flex-col justify-center h-screen font-GangwonEduPowerExtraBoldA">
                <p className="text-center text-2xl">
                  팔로우하는 채널이 아직 없습니다.
                </p>
              </div>
            ) : (
              followersData?.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.content.map((follower: any) => (
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
                  ))}
                </React.Fragment>
              ))
            )}
            <div ref={loadMoreRef}>
              {isFetchingNextFollowers
                ? "Loading more..."
                : hasNextFollowers
                ? "Load More"
                : ""}
            </div>
          </SubscribePanel>
        )}

        {/* Followings Tab */}
        {activeTab === 1 && (
          <SubscribePanel title="" href="/">
            {followingsLoading ? (
              <div>Loading followings...</div>
            ) : followingsData?.pages[0]?.content.length === 0 ? ( // 체크: followings가 없는 경우
              <div className="flex flex-col justify-center h-screen font-GangwonEduPowerExtraBoldA">
                <p className="text-center text-2xl">
                  팔로윙하는 채널이 아직 없습니다.
                </p>
              </div>
            ) : (
              followingsData?.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.content.map((following: any) => (
                    <PanelItem
                      key={following.channelId}
                      id={following.channelId}
                      src={following.channelImageUrl}
                      name={following.displayName}
                      username={following.channelName}
                      initials={following.displayName}
                      isUserChannel={following.userChannel}
                      following={following.following}
                    />
                  ))}
                </React.Fragment>
              ))
            )}
            <div ref={loadMoreRef}>
              {isFetchingNextFollowings
                ? "Loading more..."
                : hasNextFollowings
                ? "Load More"
                : ""}
            </div>
          </SubscribePanel>
        )}
      </main>
    </>
  );
};

export default HomePage;
