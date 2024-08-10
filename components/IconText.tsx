import React from "react";

interface IconTextProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
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
