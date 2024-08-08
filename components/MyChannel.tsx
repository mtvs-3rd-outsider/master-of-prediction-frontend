"use client";
import React from 'react';
import Avatar from '@components/radix/Avatar';
import {Tabs, Tab } from "@nextui-org/tabs"; 
import TierBadge from '@components/TierBadge';
import TierIcon from '@components/TierIcon';
import UserBanner from '@components/user/UserBanner';

const MyChannel: React.FC = () => {

  return (
    <div className="p-4 ">
      <div
        className="sticky  overflow-hidden "
      >
        <UserBanner
          imageUrl="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2532&q=80"
        />
      </div>
      <div className="relative  flex flex-col ">
        <div
          className="relative top-[-60px] z-10 mb-1 h-10"
          style={{
          
            transformOrigin: 'bottom center',
          }}
        >
          <Avatar
            src="https://your-avatar-url.com/avatar.jpg"
            alt="User Avatar"
            initials="RQ"
            size={90} // 아바타 크기를 동적으로 설정
          />
        </div>
        <div >
        {/* <TierBadge name={"nostradamus"}/> */}
         <div className='inline-flex gap-1'><TierIcon name={"견습생"} size={23} className="px-2" /> <h1 className="text-md m-auto font-bold">홍길동</h1>  <p className="text-xs  mb-1 mt-auto text-gray-600">@홍길동</p></div> 
      

         
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-800">
          This is a short bio about the user. It gives some information about the user's interests, background, and other relevant details.
        </p>
        <div className="mt-4 flex space-x-4">
          <div>
            <span className="font-bold">100</span> Following
          </div>
          <div>
            <span className="font-bold">200</span> Followers
          </div>
        </div>
      </div>
  
    </div>
  );
};

export default MyChannel;
