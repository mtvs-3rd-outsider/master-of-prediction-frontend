"use client";

import React, { RefObject, useEffect, useRef, useState } from "react";
import Search from "@ui/Search";
import Panel from "@ui/Panel";
import PanelItemTrends from "@ui/PanelItemTrends";
import Footer from "@ui/Footer";
import Link from "next/link";
import { sendMultipartForm } from "@handler/fetch/axios";
import { usePathname, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Image from "next/image";
interface BettingOptions {
  imgUrl: string;
  image?: File;
  content: string;
  fileInputRef: RefObject<HTMLInputElement>;
}

const BettingAddPage = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [mainPreviewUrls, setMainPreviewUrls] = useState<string[]>([]);
  const [isBlind, setIsBlind] = useState(false);
  const [options, setOptions] = useState<BettingOptions[]>([
    { imgUrl: "", image: undefined, content: "", fileInputRef: useRef(null) },
    { imgUrl: "", image: undefined, content: "", fileInputRef: useRef(null) },
  ]);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  /**
   * 마감 날짜 내일로 자동 설정
   */
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");
    const hours = String(tomorrow.getHours()).padStart(2, "0");
    const minutes = String(tomorrow.getMinutes()).padStart(2, "0");

    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    setCurrentDateTime(formattedDateTime);
  }, []);

  useEffect(() => {
    // Cleanup URLs when component unmounts
    return () => {
      mainPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mainPreviewUrls]);

  // input click method
  const handleClick = () => {
    fileRef?.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFiles = e.target.files as FileList;
    const targetFilesArray = Array.from(targetFiles);

    // Generate URLs for new files
    const newUrls = targetFilesArray.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...targetFilesArray]);
    setMainPreviewUrls((prev) => [...prev, ...newUrls]);
  };

  const handleOptionImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const updatedOptions = [...options];

      updatedOptions[index].imgUrl = URL.createObjectURL(e.target.files[0]);
      updatedOptions[index].image = e.target.files[0];

      setOptions(updatedOptions); // 변경된 옵션 상태 업데이트
    }
  };

  const handleDelete = (index: number) => {
    // Revoke the URL of the deleted image
    URL.revokeObjectURL(mainPreviewUrls[index]);

    setImages((prev) => prev.filter((_, i) => i !== index));
    setMainPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };
  const handleOptionContent = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedOptions = [...options];
    updatedOptions[index].content = e.target.value;
    setOptions(updatedOptions); // 변경된 값 반영
  };

  const handleOptionImageClick = (index: number) => {
    const fileInputRef = options[index].fileInputRef;
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click(); // input 요소 클릭
      setOptions(options);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.target as HTMLFormElement; // e.target을 HTMLFormElement로 명시
    const formData = new FormData(formElement);
    formData.append("isBlind", isBlind.toString());
    const mainImgUrl = formData.get("mainImgUrl");
    if (
      (mainImgUrl instanceof File && mainImgUrl.name.trim() == "") ||
      mainImgUrl === null
    ) {
      formData.delete("mainImgUrl");
    }

    options.forEach((option, index) => {
      if (option.image != undefined) {
        formData.append(`options_image`, option.image);
      }
      if (option.content.trim() != "") {
        formData.append(`options_content`, option.content);
      }
    });

    console.log("formData: ", Object.fromEntries(formData));
    try {
      const response = await sendMultipartForm(
        "/betting-products",
        formData,
        "post"
      );
      router.push(`/betting/${response.data}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        // AxiosError 타입으로 캐스팅하여 안전하게 접근
        console.log("Error response data: ", error.response?.data.errors);
      } else {
        // 다른 에러 타입 처리
        console.log("An unexpected error occurred: ", error);
      }
    }
  };
  // router.push("/");

  return (
    <>
      <main className="col-span-5 w-full h-auto border-x border-slate-200 p-4 pl-20 pr-20 pb-32">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`${
                isBlind
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-gray-400 hover:bg-blackA10"
              } text-white font-bold py-2 px-4 rounded-full`}
              onClick={() => setIsBlind(true)}
            >
              비공개
            </button>
            <button
              type="button"
              className={`${
                !isBlind
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-gray-400 hover:bg-blackA10"
              } text-white font-bold py-2 px-4 rounded-full`}
              onClick={() => setIsBlind(false)}
            >
              공개
            </button>
          </div>
          <h1 className="text-4xl pt-4 pb-4">등록하기</h1>
          <div className="w-full mb-6 md:mb-0">
            <label
              className="block mb-2 text-sm font-bold text-gray-600 w-full"
              htmlFor="title"
            >
              주제
            </label>
            <input
              className="appearance-none block w-full  text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="title"
              type="text"
              name="title"
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
              className="appearance-none block w-full  text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="content"
              type="text"
              name="content"
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
              name="categoryCode"
            >
              <option value="1">정치</option>
              <option value="2">경제</option>
              <option value="3">스포츠</option>
              <option value="4">일상</option>
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
                name="mainImgUrl"
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
              {mainPreviewUrls.map((url, i) => (
                <div
                  key={i}
                  // className="w-full"
                >
                  <div className="shrink-0 bg-[#efe8e8] rounded-[10px] relative overflow-hidden w-36 h-36">
                    <Image
                      src={url}
                      alt={`image${i}`}
                      className="object-contain w-full h-full"
                      width="10"
                      height="10"
                    />
                    <span
                      className="absolute bg-red-700 text-green-100 px-2 py-1 text-xs font-bold rounded-full top-1 right-2 cursor-pointer"
                      onClick={() => handleDelete(i)}
                    >
                      X
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="block w-full mb-6">
            <label
              className="block mb-2 text-sm font-bold text-gray-600 w-full"
              htmlFor="optionId"
            >
              선택지 추가하기 (기본 2개)
              <span className="text-large cursor-pointer"> + </span>
            </label>
            <div>
              {options.map(({ imgUrl, content, fileInputRef }, i) => (
                <div key={i} className="w-full grid  grid-cols-4 gap-4 py-4 ">
                  <div
                    className="border rounded-md border-gray-400 w-28 h-28 overflow-hidden"
                    onClick={() => handleOptionImageClick(i)}
                  >
                    <Image
                      src={imgUrl}
                      alt=""
                      className="object-cover w-full h-full"
                      width="10"
                      height="10"
                    />
                    <input
                      ref={fileInputRef}
                      accept="image/*"
                      type="file"
                      className="hidden"
                      onChange={(e) => handleOptionImageChange(e, i)}
                    />
                  </div>
                  <div className="col-span-3 items-center flex">
                    <input
                      className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="content"
                      type="text"
                      value={content}
                      onChange={(e) => handleOptionContent(e, i)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="block w-full mb-6">
            <label
              className="block mb-2 text-sm font-bold text-gray-600 w-full"
              htmlFor="deadLineDateTime"
            >
              마감 일자
            </label>
            <input
              className="appearance-none block w-full  text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              name="deadLineDateTime"
              id="deadLineDateTime"
              type="datetime-local"
              value={currentDateTime}
              onChange={(e) => setCurrentDateTime(e.target.value)}
            />
          </div>
          {isBlind && (
            <div className="block w-full mb-6">
              <label
                className="block mb-2 text-sm font-bold text-gray-600 w-full"
                htmlFor="blindName"
              >
                익명 아이디
              </label>
              <input
                className="appearance-none block w-full  text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="blindName"
                name="blindName"
                type="text"
                placeholder="설정할 익명 아이디"
              />
            </div>
          )}

          <div className="flex justify-end gap-4 w-full">
            <button
              type="submit"
              className="w-24 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              등록
            </button>
            {/* <button */}
            {/* > */}
            <Link
              href={"/"}
              // type="reset"
              className="text-center w-24 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
            >
              취소
            </Link>
            {/* </button> */}
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
        <Footer />
      </div>
    </aside>
  );
};

export default BettingAddPage;
