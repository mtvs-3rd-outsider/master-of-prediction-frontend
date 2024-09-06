"use client";

import React, { useRef, useState } from "react";
import Search from "@ui/Search";
import Panel from "@ui/Panel";
import PanelItem from "@ui/PanelItem";
import PanelItemTrends from "@ui/PanelItemTrends";
import Footer from "@ui/Footer";
const BettingAddPage = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);

  // input click method
  const handleClick = () => {
    fileRef?.current?.click();
  };

  const handleChange = (e: React.ChangeEvent) => {
    const targetFiles = (e.target as HTMLInputElement).files as FileList;
    const targetFilesArray = Array.from(targetFiles);
    const selectedFiles: string[] = targetFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    // 합체!
    setImages((prev) => prev.concat(selectedFiles));
  };

  const handleDelete = (index: number) => {
    // images 배열에서 클릭된 이미지를 제거
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };
  return (
    <>
      <main className="col-span-5 w-full h-auto border-x border-slate-200 p-4 pl-20 pr-20 pb-32">
        <div className="grid grid-cols-2 gap-4">
          <button
            className={`${!isPublic ? "bg-blue-500 hover:bg-blue-700" : "bg-black hover:bg-blackA10"} text-white font-bold py-2 px-4 rounded-full`}
            onClick={() => setIsPublic(false)}
          >
            비공개
          </button>
          <button
            className={`${isPublic ? "bg-blue-500 hover:bg-blue-700" : "bg-black hover:bg-blackA10"} text-white font-bold py-2 px-4 rounded-full`}
            onClick={() => setIsPublic(true)}
          >
            공개
          </button>
        </div>
        <h1 className="text-4xl pt-4 pb-4">등록하기</h1>
        <form className="w-full ">
          <div className="w-full mb-6 md:mb-0">
            <label
              className="block mb-2 text-sm font-bold text-gray-600 w-full"
              htmlFor="title"
            >
              주제
            </label>
            <input
              className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="title"
              type="text"
            />
          </div>
          <div className="w-full mb-6">
            <label
              className="block mb-2 font-bold text-gray-600 w-full"
              htmlFor="content"
            >
              내용
            </label>
            <input
              className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="content"
              type="text"
            />
          </div>

          <div className="block w-full mb-6">
            <label
              htmlFor="countries"
              className="block mb-2 font-bold text-gray-600 w-full"
            >
              카테고리
            </label>
            <select
              id="countries"
              className="h-12 border border-gray-300 text-gray-600 text-base rounded-lg block w-full py-2.5 px-4 focus:outline-none"
              defaultValue="politics"
            >
              <option value="politics">정치</option>
              <option value="economy">경제</option>
              <option value="sports">스포츠</option>
            </select>
          </div>
          <div className="block w-full mb-6">
            <div>
              <label
                htmlFor="file"
                className="cursor-pointer h-[24px] self-stretch shrink-0 basis-auto font-['ABeeZee'] text-[20px] font-normal leading-[23.64px] text-[#000] tracking-[-0.3px] relative text-left whitespace-nowrap"
                onClick={handleClick}
              >
                상품 이미지 선택
              </label>
              <input
                ref={fileRef}
                name="file"
                className="hidden"
                type="file"
                multiple
                accept="image/*"
                onChange={handleChange}
              />
              <div></div>
            </div>
            <div
              className="
						w-full h-48
				flex pt-[10px] pr-[10px] pb-[10px] pl-[10px] gap-[10px] items-start self-stretch shrink-0 flex-nowrap bg-[#cfcfcf]  relative overflow-hidden z-[3]
				overflow-x-scroll overflow-y-hidden whitespace-nowrap scrolling-touch ms-overflow-none "
            >
              {images.map((url, i) => (
                <>
                  <div
                    // w-[120px] h-[112px]
                    className="
							shrink-0 bg-[#efe8e8] rounded-[10px] relative overflow-hidden
							w-36 h-36  "
                  >
                    <img
                      src={url}
                      width="100%"
                      height="100%"
                      alt=""
                      className="object-cover"
                    />
                    <span
                      className="absolute bg-red-700 text-green-100 px-2 py-1 text-xs font-bold rounded-full top-1 right-2"
                      onClick={() => handleDelete(i)}
                    >
                      X
                    </span>
                  </div>
                  <input src={url} alt={`image${i}`} className="hidden" />
                </>
              ))}
            </div>
          </div>
          <div className="block w-full mb-6">
            <label
              className="block mb-2 text-sm font-bold text-gray-600 w-full"
              htmlFor="optionId"
            >
              선택지 추가하기 (기본 2개)
            </label>
            <input
              className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="optionId"
              type="datetime-local"
            />
          </div>
          <div className="block w-full mb-6">
            <label
              className="block mb-2 text-sm font-bold text-gray-600 w-full"
              htmlFor="dateTime"
            >
              마감 일자
            </label>
            <input
              className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="dateTime"
              type="datetime-local"
            />
          </div>
          {!isPublic && (
            <div className="block w-full mb-6">
              <label
                className="block mb-2 text-sm font-bold text-gray-600 w-full"
                htmlFor="privateId"
              >
                익명 아이디
              </label>
              <input
                className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="privateId"
                type="text"
                placeholder="설정할 익명 아이디"
              />
            </div>
          )}

          <div className="flex justify-end gap-4 w-full">
            <button className="w-24 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              등록
            </button>
            <button className="w-24 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
              취소
            </button>
          </div>
        </form>
      </main>
      <RightPanel />
    </>
  );
};

const RightPanel = () => {
  return (
    <aside className="col-span-3 hidden xl:flex flex-col w-[350px]">
      <div className="sticky top-0">
        <Search />
        <Panel title="What's happening" href="/">
          <PanelItemTrends
            title="Next JS"
            category="Development"
            stat="57.5K"
          />
          <PanelItemTrends title="Figma" category="Design" stat="107.5K" />
          <PanelItemTrends title="Webflow" category="Design" stat="127.5K" />
          <PanelItemTrends
            title="Tailwind CSS"
            category="Development"
            stat="87.5K"
          />
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
  );
};

export default BettingAddPage;
