"use client";
import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion"; // Framer Motion import

export default function Search() {
  const [isHovered, setIsHovered] = useState(false); // 상태로 검색창을 열고 닫음
  const [isTyping, setIsTyping] = useState(false); // 사용자가 검색 중인지 추적
  let closeTimeout: NodeJS.Timeout;

  // 검색창 열고 닫는 함수 (hover 시 동작)
  const toggleSearch = (hoverState: boolean) => {
    if (hoverState) {
      clearTimeout(closeTimeout); // 이전 타임아웃 취소
      setIsHovered(true); // hover 상태로 변경
    } else {
      if (!isTyping) { // 입력 중이 아닐 때만 닫음
        closeTimeout = setTimeout(() => {
          setIsHovered(false); // 10초 후에 검색창 닫기
        }, 10000);
      }
    }
  };

  // 사용자가 입력 중일 때 호출
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setIsTyping(true); // 입력 중으로 설정
    } else {
      setIsTyping(false); // 입력이 없으면 입력 중 상태를 해제
    }
  };

  return (
    <div
      className="relative my-1 mx-3 w-full flex items-center justify-start"
      onMouseEnter={() => toggleSearch(true)} // 마우스를 올리면 검색창 열기
      onMouseLeave={() => toggleSearch(false)} // 마우스를 떼면 10초 후 검색창 닫기 (입력 중이 아닐 때만)
    >
      {/* 검색 아이콘의 Motion div, 아이콘 자체는 isHovered에 의해 감추지 않음 */}
      <AnimatePresence>
        {!isHovered && (
          <motion.div
            className="absolute h-6 w-6 flex items-center justify-center"
            initial={{ opacity: 1 }} // 초기 상태에서 아이콘은 항상 보임
            animate={{ opacity: 1 }} // 아이콘은 보임
            exit={{ opacity: 0 }} // 아이콘은 사라짐
            transition={{ duration: 0.5 }}
          >
            <MagnifyingGlassIcon
              className="text-black/100 ml-3.5  dark:text-white/90 text-slate-1000 pointer-events-auto flex-shrink-0 h-4 w-4 cursor-pointer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 검색창의 Motion div, 아이콘과 겹쳐서 동작 */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute overflow-hidden" // 부모 요소에서 검색창이 자연스럽게 줄어들도록 설정
            initial={{ width: 0, opacity: 0 }} // 검색창이 닫혀 있을 때
            animate={{ width: 340, opacity: 1 }} // 열릴 때 애니메이션
            exit={{ width: 0, opacity: 0 }} // 닫힐 때 애니메이션
            transition={{ duration: 0.5 }} // 애니메이션 지속 시간
          >
            <Input
              isClearable
              radius="lg"
              className="h-8"
              classNames={{
                input: [
                  "bg-transparent",
                  "text-black/90 dark:text-white/90",
                  "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                  "bg-default-200/50",
                  "dark:bg-default/60",
                  "backdrop-saturate-200",
                  "hover:bg-default-200/70",
                  "dark:hover:bg-default/70",
                  "group-data-[focus=true]:bg-default-200/50",
                  "dark:group-data-[focus=true]:bg-default/60",
                  "!cursor-text",
                  "h-8",
                ],
              }}
              placeholder="카테고리 채널을 검색해보세요"
              startContent={
                <MagnifyingGlassIcon
                  className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-auto flex-shrink-0 h-4 w-4"
                />
              }
              onChange={handleInputChange} // 입력 중 상태 감지
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
