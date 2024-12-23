"use client";
import React, { FC } from "react";
import { Button } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface IconButtonDefaultProps {
  icon: IconDefinition;
  onClick: () => void;
  ariaLabel: string; // 접근성을 위한 aria-label 추가
  size?: "sm" | "md" | "lg" | undefined;
}

const IconButtonDefault: FC<IconButtonDefaultProps> = ({ icon, onClick, ariaLabel ,size="lg"}) => {
  return (
    <Button
    variant="light"
      isIconOnly
      size={size}
      onClick={onClick}
      className="rounded-full "
      aria-label={ariaLabel} // 접근성을 위한 aria-label 설정
    >
      <FontAwesomeIcon icon={icon} />
    </Button>
  );
};

export default IconButtonDefault;
