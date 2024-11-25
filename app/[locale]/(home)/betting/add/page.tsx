"use client";

import React, {
  ChangeEvent,
  RefObject,
  UIEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Search from "@ui/Search";
import Panel from "@ui/Panel";
import PanelItemTrends from "@ui/PanelItemTrends";
import Footer from "@ui/Footer";
import Link from "next/link";
import apiClient, { sendMultipartForm } from "@handler/fetch/axios";
import { usePathname, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CameraIcon } from "@heroicons/react/24/solid";
import { Toaster, toast } from "react-hot-toast";

interface BettingOptions {
  imgUrl: string;
  image?: File;
  content: string;
  fileInputRef: RefObject<HTMLInputElement>;
}

interface CategoryDTO {
  channelId: number;
  displayName: string;
}

interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
}

const BettingAddPage = () => {
  const t = useTranslations();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryList, setCategoryList] = useState<CategoryDTO[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      if (isLoading || !hasMore) return;

      setIsLoading(true);
      try {
        const response = await apiClient.get<PageableResponse<CategoryDTO>>(
          `/category-channels?page=${page}&size=10`
        );

        setCategoryList((prev) => [...prev, ...response.data.content]); // 기존 데이터에 새 데이터 추가
        setHasMore(!response.data.last); // 마지막 페이지인지 여부 설정
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [page]); // 페이지 번호가 변경될 때마다 실행

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
    setMainPreviewUrls((prev) => {
      return [...prev, ...newUrls];
    });
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

    console.log("isSubmitting: ", isSubmitting);
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    const formElement = e.target as HTMLFormElement; // e.target을 HTMLFormElement로 명시
    console.log("formElement: ", formElement);
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

    formData.append("categoryCode", "1");
    let loadingToast;
    try {
      // 로딩 상태 알림 표시
      loadingToast = toast.loading(t("등록 로딩"));

      // 요청 처리
      const response = await sendMultipartForm(
        "/betting-products",
        formData,
        "post"
      );

      // 성공 시 알림 및 페이지 이동
      toast.success(t("등록 성공"), { id: loadingToast });
      router.push(`/betting/${response.data}`);
    } catch (error) {
      // 에러 처리
      if (error instanceof AxiosError) {
        // 서버에서 제공된 에러 메시지
        console.log("Error response data: ", error.response?.data.errors);

        // 서버 에러 메시지 기반으로 알림 표시
        toast.error(error.response?.data?.message || t("등록 실패"), {
          id: loadingToast,
        });
        setIsSubmitting(false);
      } else {
        // 예상치 못한 에러
        console.log("An unexpected error occurred: ", error);
        toast.error("An unexpected error occurred.", { id: loadingToast });
      }
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value); // 선택된 카테고리를 상태에 저장
  };

  const handleScroll = (e: UIEvent<HTMLSelectElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
      setPage((prev) => prev + 1); // 스크롤이 바닥에 닿으면 다음 페이지 로드
    }
  };

  return (
    <>
      <main className="col-span-5 w-full h-auto border-x border-slate-200 p-4 md:px-20 pb-32 sm:pl-8 sm:pr-8">
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
              {t("비공개")}
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
              {t("공개")}
            </button>
          </div>
          <h1 className="text-4xl pt-4 pb-4"> {t("등록하기")}</h1>
          <div className="w-full mb-6 md:mb-0">
            <label
              className="block mb-2 text-sm font-bold text-gray-600 w-full"
              htmlFor="title"
            >
              {t("주제")}
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
              {t("내용")}
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
              {t("카테고리")}
            </label>
            {/* <select
              id="categories"
              className="h-12 border border-gray-300 text-gray-600 text-base rounded-lg block w-full py-2.5 px-4 focus:outline-none"
              value={selectedCategory}
              onChange={handleCategoryChange} // 선택 값 변경 핸들러
            >
              <option value="" disabled>
                카테고리를 선택하세요
              </option>
              {categoryList.map((category) => (
                <option key={category.channelId} value={category.channelId}>
                  {category.displayName}
                </option>
              ))}
            </select> */}
            <select
              id="categories"
              className="h-12 border border-gray-300 text-gray-600 text-base rounded-lg block w-full py-2.5 px-4 focus:outline-non overflow-y-auto"
              value={selectedCategory}
              onChange={handleCategoryChange}
              onScroll={handleScroll} // 스크롤 이벤트 핸들러
            >
              <option value="" disabled>
                카테고리를 선택하세요
              </option>
              {categoryList.map((category) => (
                <option
                  key={category.channelId}
                  value={category.channelId.toString()}
                >
                  {category.displayName}
                </option>
              ))}
              {isLoading && <option disabled>로딩 중...</option>}
            </select>
          </div>
          <div className="block w-full mb-6">
            <div>
              <label
                htmlFor="file"
                className="cursor-pointer h-[24px] self-stretch shrink-0 basis-auto font-['ABeeZee'] text-[19px] font-normal leading-[23.64px] text-[#000] tracking-[-0.3px] relative text-left whitespace-nowrap"
              >
                {t("미리보기 이미지")}
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
              onClick={handleClick}
              className="
						w-full h-48
				flex pt-[10px] pr-[10px] pb-[10px] pl-[10px] gap-[10px] items-start self-stretch shrink-0 flex-nowrap bg-[#cfcfcf]  relative overflow-hidden z-[3]
				overflow-x-scroll overflow-y-hidden whitespace-nowrap scrolling-touch ms-overflow-none "
            >
              {fileRef.current?.files?.length == 0 && (
                <CameraIcon className="w-full h-full" />
              )}
              {mainPreviewUrls.map((url, i) => (
                <div key={i}>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="shrink-0 bg-[#efe8e8] rounded-[10px] relative overflow-hidden w-36 h-36"
                  >
                    <Image
                      src={url}
                      alt={`image${i}`}
                      objectFit="fill"
                      className="w-full h-full"
                      // className="object-contain w-full h-full"
                      width="10"
                      height="10"
                    />
                    <span
                      className="absolute bg-red-700 text-green-100 px-2 py-1 text-xs font-bold rounded-full top-1 right-2 cursor-pointer"
                      onClick={() => {
                        handleDelete(i);
                      }}
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
              {t("선택지 추가하기")}

              <span className="text-large cursor-pointer"> + </span>
            </label>
            <div>
              {options.map(({ imgUrl, content, fileInputRef }, i) => (
                <div key={i} className="w-full grid  grid-cols-4 gap-4 py-4 ">
                  <div
                    className="border rounded-md border-gray-400 sm:w-28 sm:h-28 w-18 h-18 overflow-hidden "
                    onClick={() => handleOptionImageClick(i)}
                  >
                    {imgUrl && (
                      <Image
                        src={imgUrl}
                        alt=""
                        objectFit="fill"
                        // className="object-cover w-full h-full"
                        className="w-full h-full"
                        width="10"
                        height="10"
                      />
                    )}
                    {!imgUrl && <CameraIcon className="w-full h-full" />}
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
              {t("마감일자")}
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
              {t("등록하기")}
            </button>
            {/* <button */}
            {/* > */}
            <Link
              href={"/"}
              // type="reset"
              className="text-center w-24 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
            >
              {t("취소")}
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
