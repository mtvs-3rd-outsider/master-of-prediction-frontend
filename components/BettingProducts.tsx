"use client";

import { useState } from "react";
import Account from "./Account";
import AccountNavItem from "./AccountNavItem";
import Avatar from "./AvatarWithIcon";
import Button from "./Button";
import BettingOptionList from "./BettingOptionList";
import {
  HeartIcon,
  ArrowUpTrayIcon,
  ChatBubbleOvalLeftIcon,
  ArrowPathIcon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/outline"; // Heroicons에서 아이콘 가져오기
import BettingCommentActivityTabs from "./BettingCommentActivityTabs";

function BettingProducts() {
  const [data, setData] = useState({});

  return (
    <>
      <div className="flex flex-1 items-center gap-x-2">
        <Account userId="1" />
        <Button>정산하기</Button>
      </div>
      {/* <div className="flex flex-1 items-center gap-x-2 px-4"> */}
      <div>주제 탭 바이든 VS 트럼프</div>
      <div>내용 탭 다음 대선 바이든 VS 트럼프 누가 될까요?</div>
      <div>
        <ul
          className="mt-4 mb-4 
        flex gap-x-10 xl:gap-x-14 text-xs text-slate-700 [&_li:first-child]:hidden [&_li:first-child]:lg:flex [&_li]:flex [&_li]:items-center [&_li]:gap-x-2 [&_li:xl]:gap-x-3 "
        >
          <li className="">
            <ChartBarSquareIcon className="w-5 h-5" />
            20
          </li>
          <li>
            <ChatBubbleOvalLeftIcon className="w-5 h-5" />2
          </li>
          <li>
            <ArrowPathIcon className="w-5 h-5" />1
          </li>
          <li>
            <HeartIcon className="w-5 h-5" />
            23
          </li>
          <li>
            <ArrowUpTrayIcon className="w-5 h-5" />
          </li>
        </ul>
      </div>
      <BettingOptionList />
      <BettingCommentActivityTabs />
    </>
    // <div className="main-container flex w-[600px] h-[1239px] flex-col gap-px items-start flex-nowrap relative mx-auto my-0">
    //   <div className="flex h-[501px] flex-col gap-px items-start self-stretch shrink-0 flex-nowrap bg-[#fff] relative">
    //     <div className="flex w-[597px] h-[501px] flex-col items-center shrink-0 flex-nowrap relative overflow-hidden z-[1]">
    //       <div className="h-[341px] self-stretch shrink-0 bg-[#fff] relative shadow-[0_0.33px_0_0_#ced5dc] z-[2]" />
    //       <div className="flex w-[597px] h-[436px] flex-col gap-[13px] items-center shrink-0 flex-nowrap absolute top-[13.5px] left-[0.5px] z-[4]">
    //         <div className="flex w-[155px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[5]">
    //           <span className="h-[18px] shrink-0 basis-auto font-['Abel'] text-[14px] font-normal leading-[17.842px] text-[#687684] tracking-[-0.2px] relative text-left whitespace-nowrap z-[7]">
    //             The UX Person Retweeted
    //           </span>
    //         </div>
    //         <div className="w-[598px] h-[336px] shrink-0 relative z-[8]">
    //           <div className="flex w-[374px] h-[300px] flex-col gap-[23px] items-start flex-nowrap relative z-[9] mt-[0.5px] mr-0 mb-0 ml-px">
    //             <div className="flex w-[133px] gap-[8px] items-center shrink-0 flex-nowrap relative z-10">
    //               <div className="w-[70px] shrink-0 font-['Abel'] text-[16px] font-normal leading-[20.391px] tracking-[-0.3px] relative text-left z-[12]">
    //                 <span className="font-['Abel'] text-[16px] font-normal leading-[20.391px] text-[#141619] tracking-[-0.3px] relative text-left">
    //                   karennne
    //                   <br />
    //                 </span>
    //                 <span className="font-['Abel'] text-[16px] font-normal leading-[20.391px] text-[#687684] tracking-[-0.3px] relative text-left">
    //                   @karennne
    //                 </span>
    //               </div>
    //             </div>
    //             <span className="h-[31px] self-stretch shrink-0 basis-auto font-['ABeeZee'] text-[22px] font-normal leading-[31px] text-[#141619] tracking-[-0.7px] relative text-left whitespace-nowrap z-[13]">
    //               바이든 VS 트럼프
    //             </span>
    //             <div className="flex w-[269px] gap-[23px] items-start shrink-0 flex-nowrap relative z-[14]"></div>
    //             <div className="flex w-[224px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[17]">
    //               <span className="h-[18px] shrink-0 basis-auto font-['Abel'] text-[14px] font-normal leading-[17.842px] text-[#687684] tracking-[-0.2px] relative text-left whitespace-nowrap z-[18]">
    //                 다음 대선 바이든 vs 트럼프 누가될까요?
    //               </span>
    //             </div>
    //           </div>
    //           <div className="w-[597px] h-[14px] font-['Abel'] text-[16px] font-normal leading-[14px] tracking-[-0.3px] relative text-left whitespace-nowrap z-[19] mt-[12px] mr-0 mb-0 ml-0">
    //             <span className="font-['Abel'] text-[16px] font-normal leading-[20.391px] text-[#687684] tracking-[-0.3px] relative text-left">
    //               09:28 · 2/21/20 ·
    //             </span>
    //             <span className="font-['Abel'] text-[16px] font-normal leading-[20.391px] text-[#4c9eeb] tracking-[-0.3px] relative text-left">
    //               Twitter Web App
    //             </span>
    //           </div>
    //           <div className="flex w-[127px] gap-[7px] items-center flex-nowrap relative z-[21] mt-[11.854px] mr-0 mb-0 ml-px">
    //             <div className="w-[69px] shrink-0 font-['Abel'] text-[16px] font-normal leading-[20px] tracking-[-0.3px] relative text-left whitespace-nowrap z-[22]">
    //               <span className="font-['Abel'] text-[16px] font-normal leading-[20.391px] text-[#141619] tracking-[-0.3px] relative text-left">
    //                 6
    //               </span>
    //               <span className="font-['Abel'] text-[16px] font-normal leading-[20.391px] text-[#687684] tracking-[-0.3px] relative text-left"></span>
    //               <span className="font-['Abel'] text-[16px] font-normal leading-[20.391px] text-[#687684] tracking-[-0.3px] relative text-left">
    //                 Retweets
    //               </span>
    //             </div>
    //             <div className="w-[51px] shrink-0 font-['Abel'] text-[16px] font-normal leading-[20px] tracking-[-0.3px] relative text-left whitespace-nowrap z-[23]">
    //               <span className="font-['Abel'] text-[16px] font-normal leading-[20.391px] text-[#141619] tracking-[-0.3px] relative text-left">
    //                 15
    //               </span>
    //               <span className="font-['Abel'] text-[16px] font-normal leading-[20.391px] text-[#687684] tracking-[-0.3px] relative text-left"></span>
    //               <span className="font-['Abel'] text-[16px] font-normal leading-[20.391px] text-[#687684] tracking-[-0.3px] relative text-left">
    //                 Likes
    //               </span>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="flex w-[600px] flex-col gap-[4px] items-start shrink-0 flex-nowrap relative z-[25]">
    //     <div className="flex w-[600px] h-[89px] pt-[15px] pr-[28px] pb-[15px] pl-[28px] gap-[110px] items-center shrink-0 flex-nowrap bg-[#fff] rounded-[8px] relative shadow-[0_2px_4px_0_rgba(0,0,0,0.08)] z-[26]">
    //       <div className="flex w-[178.464px] gap-[21px] justify-center items-center shrink-0 flex-nowrap relative z-[27]">
    //         <div className="w-[87.464px] h-[18.804px] shrink-0 relative z-[29]">
    //           <span className="flex h-[18.804px] justify-start items-start font-['ABeeZee'] text-[16px] font-normal leading-[18.804px] text-[#212529] absolute top-0 left-0 text-left whitespace-nowrap z-30">
    //             트럼프
    //           </span>
    //         </div>
    //       </div>
    //       <div className="flex w-[255.411px] gap-[42px] items-center shrink-0 flex-nowrap relative z-[31]">
    //         <div className="flex w-[125.948px] flex-col gap-[5px] items-start shrink-0 flex-nowrap relative z-[33]">
    //           <span className="h-[18.804px] self-stretch shrink-0 basis-auto font-['ABeeZee'] text-[16px] font-normal leading-[18.804px] text-[#343a40] relative text-left whitespace-nowrap z-[34]">
    //             ₹2,509.75
    //           </span>
    //           <span className="h-[12.223px] self-stretch shrink-0 basis-auto font-['ABeeZee'] text-[10px] font-normal leading-[11.82px] text-[#21bf73] relative text-left whitespace-nowrap z-[35]">
    //             +9.77%
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="w-[599.98px] h-[72px] shrink-0 relative z-[36]">
    //       <div className="w-[599.98px] h-[72px] absolute top-0 left-0 z-[37]">
    //         <div className="w-[599.98px] h-[72px] bg-[#fff] rounded-[8px] absolute top-0 right-0 shadow-[0_2px_4px_0_rgba(0,0,0,0.08)] z-[38]" />
    //         <span className="flex h-[20px] justify-start items-center font-['ABeeZee'] text-[16px] font-normal leading-[18.912px] text-[#343a40] absolute top-[17px] right-[31.486px] text-left whitespace-nowrap z-40">
    //           ₹2,509.75
    //         </span>
    //         <span className="flex h-[20px] justify-start items-start font-['ABeeZee'] text-[16px] font-normal leading-[18.912px] text-[#212529] absolute top-[28px] left-[119px] text-left whitespace-nowrap z-[39]">
    //           바이든
    //         </span>
    //         <span className="flex h-[13px] justify-start items-center font-['ABeeZee'] text-[10px] font-normal leading-[11.82px] text-[#d90429] absolute top-[42px] right-[27.988px] text-left whitespace-nowrap z-[41]">
    //           -21.00%
    //         </span>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="w-[598px] h-[30px] shrink-0 bg-[#fff] relative overflow-hidden z-[44]">
    //     <span className="flex h-[24px] justify-start items-center font-['ABeeZee'] text-[20px] font-normal leading-[23.64px] text-[#000] absolute top-[3px] left-[43px] text-left underline whitespace-nowrap z-[45]">
    //       댓글
    //     </span>
    //     <span className="flex h-[24px] justify-start items-center font-['ABeeZee'] text-[20px] font-normal leading-[23.64px] text-[#000] absolute top-[3px] left-[140px] text-left whitespace-nowrap z-[46]">
    //       활동내역
    //     </span>
    //     <span className="flex h-[24px] justify-start items-center font-['ABeeZee'] text-[20px] font-normal leading-[23.64px] text-[#000] absolute top-[3px] left-[280px] text-left whitespace-nowrap z-[47]">
    //       랭킹
    //     </span>
    //   </div>
    //   <div>
    //     <div className="w-[308.625px] h-[20px] relative z-[58] mt-[184px] mr-0 mb-0 ml-[99px]">
    //       <span className="flex h-[20px] justify-start items-start font-['Abel'] text-[16px] font-normal leading-[20px] text-[#4c9eeb] tracking-[-0.3px] absolute top-0 left-0 text-left whitespace-nowrap z-[58]">
    //         1 more reply
    //       </span>
    //     </div>
    //     <div className="w-[357.625px] h-[55px] absolute top-[9px] left-[50px] z-[56]">
    //       <div className="w-[129px] h-[20px] font-['Abel'] text-[16px] font-normal leading-[20px] tracking-[-0.3px] absolute top-[6px] left-[63px] text-left whitespace-nowrap z-[55]">
    //         <span className="font-['Abel'] text-[16px] font-normal leading-[20.391px] text-[#141619] tracking-[-0.3px] relative text-left">
    //           kiero_d
    //         </span>
    //         <span className="font-['Abel'] text-[16px] font-normal leading-[20.391px] text-[#687684] tracking-[-0.3px] relative text-left">
    //           @kiero_d
    //         </span>
    //         <span className="font-['Abel'] text-[16px] font-normal leading-[20.391px] text-[#687684] tracking-[-0.3px] relative text-left">
    //           ·2d
    //         </span>
    //       </div>
    //       <div className="w-[137px] h-[20px] font-['Abel'] text-[16px] font-normal leading-[20px] tracking-[-0.3px] absolute top-[29px] left-[63px] text-left whitespace-nowrap z-[56]">
    //         <span className="font-['Abel'] text-[16px] font-normal leading-[20.391px] text-[#687684] tracking-[-0.3px] relative text-left">
    //           Replying to
    //         </span>
    //         <span className="font-['Abel'] text-[16px] font-normal leading-[20.391px] text-[#4c9eeb] tracking-[-0.3px] relative text-left">
    //           @karennne
    //         </span>
    //       </div>
    //     </div>
    //     <div className="w-[548px] h-[125px] absolute top-[50px] left-[50px] z-[65]">
    //       <div className="w-[502px] h-[82px] font-['Abel'] text-[16px] font-normal leading-[20.5px] tracking-[-0.3px] absolute top-[43px] left-[46px] text-left z-[57]">
    //         <span className="font-['Abel'] text-[16px] font-normal leading-[20.5px] text-[#141619] tracking-[-0.3px] relative text-left">
    //           Interesting Nicola that not one reply or tag on this
    //         </span>
    //         <span className="font-['Abel'] text-[16px] font-normal leading-[20.5px] text-[#4c9eeb] tracking-[-0.3px] relative text-left">
    //           #UX
    //         </span>
    //         <span className="font-['Abel'] text-[16px] font-normal leading-[20.5px] text-[#141619] tracking-[-0.3px] relative text-left">
    //           talent shout out in the 24hrs since your tweet here......🤔
    //         </span>
    //       </div>
    //       <span className="flex h-[15px] justify-start items-start font-['Abel'] text-[12px] font-normal leading-[15px] text-[#687684] tracking-[-0.3px] absolute top-[110px] left-[67.5px] text-left whitespace-nowrap z-[64]">
    //         1
    //       </span>
    //       <span className="flex h-[15px] justify-start items-start font-['Abel'] text-[12px] font-normal leading-[15px] text-[#687684] tracking-[-0.3px] absolute top-[110px] left-[230.5px] text-left whitespace-nowrap z-[65]">
    //         1
    //       </span>
    //     </div>
    //   </div>
    // </div>
  );
}

export default BettingProducts;
