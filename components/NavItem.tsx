"use client";
import { cva } from "class-variance-authority";
import Link from "next/link";

import React, { ReactNode } from "react";

interface Props {
  href?: string;
  width: "full" | "inline" | "mobile";
  size: "default" | "small" | "large";
  children: ReactNode;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => void;
}

const NavItemStyles = cva(
  "flex items-center gap-x-4 px-4 py-3 hover:bg-slate-100 text-slate-900 my-1",
  {
    variants: {
      width: {
        full: "w-full",
        inline: "max-w-fit rounded-full",
        mobile: "inline-flex justify-center xl:justify-start ",
      },
      size: {
        default: "",
        small: "py-2 [&_div:last-child]:text-sm my-0",
        large: "",
      },
    },
    defaultVariants: {
      width: "inline",
      size: "default",
    },
  }
);

const NavItem = ({ href, children, width, size, onClick }: Props) => {
  if (onClick) {
    return (
      <button className={NavItemStyles({ width, size })} onClick={onClick}>
        {children}
      </button>
    );
  }
  return (
    <Link
      className={NavItemStyles({ width, size })}
      href={href || "#"}
      prefetch={true}
      scroll={true}
    >
      {children}
    </Link>
  );
};

export default NavItem;
