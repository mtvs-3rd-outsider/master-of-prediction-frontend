"use client";

// import * as TextField from "@radix-ui/react-text-field";

export default function OrderForm() {
  return (
    <div className="main-container w-[356px] h-[374px] relative mx-auto my-0">
      <div className="w-full h-full text-[0px] bg-[#fff] rounded-tl-[4px] rounded-tr-none rounded-br-none rounded-bl-[4px] border-solid border border-[#f0f1f3] absolute top-0 left-0 z-[2]">
        <span className="block h-[16px] font-['Inter'] text-[12px] font-semibold leading-[16px] text-[#454e68] tracking-[0.3px] relative text-left uppercase whitespace-nowrap z-[5] mt-[8px] mr-0 mb-0 ml-[12px]">
          Create order
        </span>
        <div className="w-[327.708px] h-[36px] relative z-[46] mt-[13.236px] mr-0 mb-0 ml-[12.967px]">
          <div className="w-1/2 h-[36px] bg-[#e7fbf0] rounded-tl-[4px] rounded-tr-none rounded-br-none rounded-bl-[4px] absolute top-0 left-0 z-[43]">
            <span className="flex w-[125.125px] h-[100.54%] justify-center items-center font-['Inter'] text-[14px] font-semibold leading-[20px] text-[#00632b] absolute top-0 left-[11.82%] text-center z-[44]">
              Buy
            </span>
          </div>
          <div className="w-1/2 h-[36px] rounded-tl-none rounded-tr-[4px] rounded-br-[4px] rounded-bl-none border-solid border border-[#dbdde5] absolute top-0 left-1/2 z-[46]">
            <span className="flex w-[120.656px] h-[100.54%] justify-center items-center font-['Inter'] text-[14px] font-semibold leading-[20px] text-[#9199b1] absolute top-[-2.78%] left-[13.03%] text-center z-[47]">
              Sell
            </span>
          </div>
        </div>
        <div className="flex w-[327.709px] flex-col gap-4 items-start flex-nowrap relative z-[9] mt-[48.764px] mr-0 mb-0 ml-[12.967px]">
          <input
            type="text"
            id="first_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Price"
            required
          />
          <input
            type="text"
            id="first_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Amount"
            required
          />
        </div>
        <div className="flex w-[328px] h-[25px] justify-between items-center relative z-[36] mt-[48.473px] mr-0 mb-0 ml-[12.967px]">
          <span className="h-[25px] shrink-0 font-['Inter'] text-[14px] font-medium leading-[20px] text-[#5a6689] relative text-left whitespace-nowrap z-[36]">
            Total
          </span>
          <div className="flex w-[77px] h-[25px] justify-between items-center shrink-0 relative z-[32]">
            <span className="h-[20px] shrink-0 font-['Inter'] text-[14px] font-semibold leading-[20px] text-[#303648] relative text-left whitespace-nowrap z-[31]">
              0.00
            </span>
            <span className="h-[20px] shrink-0 font-['Inter'] text-[14px] font-medium leading-[20px] text-[#76809d] relative text-left whitespace-nowrap z-[32]">
              USDT
            </span>
          </div>
        </div>
        <div className="flex w-[328px] h-[17px] justify-between items-center relative z-[37] mt-[-4px] mr-0 mb-0 ml-[12.967px]">
          <span className="h-[15px] shrink-0 font-['Inter'] text-[12px] font-medium leading-[15px] text-[#5a6689] relative text-left whitespace-nowrap z-[37]">
            보유포인트
          </span>
          <div className="flex w-[73px] h-[17px] justify-between items-center shrink-0 relative z-[35]">
            <span className="flex w-[38px] h-[16px] justify-end items-start shrink-0 font-['Inter'] text-[12px] font-medium leading-[16px] text-[#303648] relative text-right whitespace-nowrap z-[34]">
              27000
            </span>
            <span className="flex w-[33px] h-[16px] justify-end items-start shrink-0 font-['Inter'] text-[12px] font-medium leading-[16px] text-[#76809d] relative text-right whitespace-nowrap z-[35]">
              USDT
            </span>
          </div>
        </div>
        <button className="flex w-[328px] h-[40.215px] justify-center items-center bg-[#00632b] rounded-[4px] border-none relative z-40 pointer mt-[11.254px] mr-0 mb-0 ml-[12.967px]">
          <span className="flex w-[328px] h-[40.215px] justify-center items-center shrink-0 font-['Inter'] text-[14px] font-medium leading-[20px] text-[#e7fbf0] relative text-center z-40">
            Buy
          </span>
        </button>
      </div>
    </div>
  );
}
