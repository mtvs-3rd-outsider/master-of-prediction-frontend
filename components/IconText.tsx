import React from "react";

interface IconTextProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string | JSX.Element; // string 또는 JSX 요소를 허용
}

const IconText: React.FC<IconTextProps> = ({ icon: Icon, text }) => {
  return (
    <div className="inline-flex items-center mr-3">
      <Icon className="h-3 w-3 " />
      <span className="text-xs whitespace-nowrap">{text}</span>
    </div>
  );
};

export default IconText;
