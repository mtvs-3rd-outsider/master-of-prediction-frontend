// FloatingActionButton.tsx
import React from "react";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useRouter, usePathname } from "next/navigation";

interface FloatingActionButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export default function FloatingActionButton({
  href,
  label,
  className = "",
}: FloatingActionButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    let channelType;
    let channelId = pathname.split("/").pop();

    if (pathname.includes("/channel/")) {
      channelType = "MYCHANNEL";
    } else if (pathname.includes("/category-channel/")) {
      channelType = "CATEGORYCHANNEL";
    }

    if (channelId && !isNaN(Number(channelId))) {
      router.push(`${href}?channelId=${channelId}&channelType=${channelType}`);
    } else {
      router.push(href);
    }
  };

  return (
    <Button
      isIconOnly={!label}
      color="primary"
      aria-label={label || "Add"}
      className={`fixed bottom-20 right-4 md:bottom-4 rounded-full p-3 shadow-lg ${className}`}
      onPress={handleClick}
    >
      <div className="flex items-center gap-2">
        <PlusIcon className="h-5 w-5" />
        {label && <span>{label}</span>}
      </div>
    </Button>
  );
}