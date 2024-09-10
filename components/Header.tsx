"use client";

const Header = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <div className="sticky bg-white/75 z-10 backdrop-blur-md top-0">
    <div className="flex items-center justify-start px-4 py-2">
      {/* 제목 텍스트 */}
      <h2 className="text-lg font-bold">{title}</h2>
      
      {/* 오른쪽에 들어갈 검색 컴포넌트 */}
      <div className="flex-shrink-0">{children}</div>
    </div>
  </div>
);

export default Header;
