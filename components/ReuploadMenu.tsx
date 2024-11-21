import React, { useState, useRef, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import axios from "@handler/fetch/axios";
import useUserStore from "@store/useUserStore";
interface ReuploadMenuProps {
  feedId: string;
  isShare: boolean;
  shareCount: number;
  onToggleReupload: (e: React.MouseEvent) => void;
  onQuote: (e: React.MouseEvent) => void; // 추가
}
const ReuploadMenu: React.FC<ReuploadMenuProps> = ({
  feedId,
  isShare,
  shareCount,
  onToggleReupload,
  onQuote, // 추가
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // 기본 동작 방지
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={menuRef}>
      <div
        onClick={toggleMenu}
        className="flex items-center gap-x-2 cursor-pointer"
      >
        <ArrowPathIcon
          className={`w-5 h-5 transition-colors duration-200 ${
            isShare ? "text-blue-500" : ""
          } hover:text-gray-600`}
        />
        <span>{shareCount}</span>
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 py-2 w-32 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
          {/* <button
            onClick={(e) => {
              e.preventDefault(); // 기본 동작 방지
              e.stopPropagation();
              onToggleReupload(e);
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors duration-200"
          >
            {isShare ? "재업로드 취소" : "재업로드"}
          </button> */}
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault(); // 기본 동작 방지
              e.stopPropagation();
              onQuote(e);
              setIsOpen(false);
            }}
          >
            인용하기
          </button>
        </div>
      )}
    </div>
  );
};

export default ReuploadMenu;
