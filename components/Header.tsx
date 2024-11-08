"use client";
import React from "react";

const Header = ({ 
  title, 
  children, 
  hide,
  onSortChange 
}: { 
  title: string; 
  children?: React.ReactNode; 
  hide?: boolean;
  onSortChange?: (value: string) => void;
}) => {
  const [selectedSort, setSelectedSort] = React.useState("latest");

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    onSortChange?.(value);
  };

  return (
    <>
      {!hide && (
        <div className="sticky bg-white/75 z-10 backdrop-blur-md top-0">
          <div className="flex items-center px-4 py-2">
            {title === "Home" ? (
              <div className="flex gap-2">
                <label className="relative">
                  <input
                    type="radio"
                    name="sort"
                    value="latest"
                    checked={selectedSort === "latest"}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  <span className={`px-3 py-1 rounded-full text-sm transition-all cursor-pointer border-2
                    ${selectedSort === "latest" 
                      ? "bg-white-100 border-sky-400 text-sky-600 font-semibold" 
                      : "border-gray-300 hover:bg-gray-100 font-normal text-gray-600"
                    }`}
                  >
                    최신
                  </span>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    name="sort"
                    value="follow"
                    checked={selectedSort === "follow"}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  <span className={`px-3 py-1 rounded-full text-sm transition-all cursor-pointer border-2
                    ${selectedSort === "follow" 
                      ? "bg-white-100 border-sky-400 text-sky-600 font-semibold" 
                      : "border-gray-300 hover:bg-gray-100 font-normal text-gray-600"
                    }`}
                  >
                    팔로잉
                  </span>
                </label>

                <label className="relative">
                  <input
                    type="radio"
                    name="sort"
                    value="views"
                    checked={selectedSort === "views"}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  <span className={`px-3 py-1 rounded-full text-sm transition-all cursor-pointer border-2
                    ${selectedSort === "views" 
                      ? "bg-white-100 border-sky-400 text-sky-600 font-semibold" 
                      : "border-gray-300 hover:bg-gray-100 font-normal text-gray-600"
                    }`}
                  >
                    인기
                  </span>
                </label>

                <label className="relative">
                  <input
                    type="radio"
                    name="sort"
                    value="likes"
                    checked={selectedSort === "likes"}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  <span className={`px-3 py-1 rounded-full text-sm transition-all cursor-pointer border-2
                    ${selectedSort === "likes" 
                      ? "bg-white-100 border-sky-400 text-sky-600 font-semibold" 
                      : "border-gray-300 hover:bg-gray-100 font-normal text-gray-600"
                    }`}
                  >
                    좋아요
                  </span>
                </label>
              </div>
            ) : (
              <h1 className="text-lg font-semibold">{title}</h1>
            )}
            <div className="ml-auto">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;