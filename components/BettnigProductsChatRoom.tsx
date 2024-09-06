"use client";

export default function BettingProductsChatRoom() {
  return (
    <div className="main-container w-[356px] h-[383px] bg-[#e1f2fa] rounded-[16px] relative mx-auto my-0">
      <div className="flex w-[331px] h-[133px] pt-0 pr-[40px] pb-0 pl-0 flex-col gap-[8px] items-start flex-nowrap relative z-[1] mt-[116px] mr-0 mb-0 ml-0">
        <div className="flex gap-[8px] items-start self-stretch shrink-0 flex-nowrap relative z-[2]">
          <div className="w-[24px] h-[24px] shrink-0 rounded-[100px] border-solid border border-[#fff] relative overflow-hidden shadow-[0_4px_6px_0_rgba(13,10,44,0.06)] z-[3]"></div>
          <div className="flex flex-col gap-[8px] items-start grow shrink-0 basis-0 flex-nowrap relative z-[5]">
            <span className="flex w-[93px] h-[14px] justify-center items-start shrink-0 basis-auto font-['Roboto'] text-[12px] font-normal leading-[14px] text-[#9a9bb1] relative text-center whitespace-nowrap z-[6]">
              Edward Davidson
            </span>
            <div className="flex pt-[12px] pr-[16px] pb-[12px] pl-[16px] flex-col gap-[8px] items-start self-stretch shrink-0 flex-nowrap bg-[#fff] rounded-tl-none rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px] relative z-[7]">
              <span className="flex w-[227px] h-[57px] justify-start items-start self-stretch shrink-0 font-['Roboto'] text-[16px] font-normal leading-[18.75px] text-[#2c2d3a] relative text-left z-[8]">
                Oh! <br />
                They fixed it and upgraded the security further. 🚀
              </span>
              <span className="h-[14px] shrink-0 basis-auto font-['Roboto'] text-[12px] font-medium leading-[14px] text-[#d0d1db] relative text-left whitespace-nowrap z-[9]">
                10:14
              </span>
            </div>
          </div>
        </div>
      </div>
      <button className="flex w-[95px] pt-[12px] pr-[16px] pb-[12px] pl-[16px] flex-col gap-[8px] items-end flex-nowrap bg-[#1565c0] rounded-tl-[16px] rounded-tr-[16px] rounded-br-none rounded-bl-[16px] border-none relative z-10 pointer mt-[11px] mr-0 mb-0 ml-[233px]">
        <span className="h-[19px] shrink-0 basis-auto font-['Roboto'] text-[16px] font-normal leading-[18.75px] text-[#fff] relative text-left whitespace-nowrap z-[11]">
          Great! 😊
        </span>
        <div className="flex w-[53px] gap-[8px] justify-end items-start shrink-0 flex-nowrap relative z-[12]">
          <span className="h-[14px] shrink-0 basis-auto font-['Roboto'] text-[12px] font-medium leading-[14px] text-[#e9eaeb] relative text-left whitespace-nowrap z-[13]">
            10:20
          </span>
          <div className="w-[14px] h-[14px] shrink-0 relative overflow-hidden z-[14]"></div>
        </div>
      </button>
      <div className="w-[356px] h-[47px] bg-[#fff] rounded-[10px] border-solid border-[0.5px] border-[#000] relative mt-[11px] mr-0 mb-0 ml-0" />
    </div>
  );
}
