"use client";
import { IconButton } from "@material-tailwind/react";
import { FC } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface IconButtonDefaultProps {
  icon: IconDefinition;
  onClick: () => void;
}

const IconButtonDefault: FC<IconButtonDefaultProps> = ({ icon, onClick }) => {
  return (
    <IconButton size="sm" variant="text" onClick={onClick} className="rounded-full">
      <FontAwesomeIcon icon={icon} />
    </IconButton>
  );
};

export default IconButtonDefault;
