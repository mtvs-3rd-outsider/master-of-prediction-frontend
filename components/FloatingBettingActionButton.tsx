// FloatingBettingActionButton.tsx
import React from "react";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

interface FloatingBettingActionButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export default function FloatingBettingActionButton({
  href,
  label,
  className = "",
}: FloatingBettingActionButtonProps) {
  const router = useRouter();

  return (
    <Button
      isIconOnly={!label}
      color="secondary"
      aria-label={label || "Add Betting"}
      className={`fixed bottom-20 right-4 md:bottom-4 rounded-full p-3 shadow-lg ${className}`}
      onPress={() => router.push(href)}
    >
      <div className="flex items-center gap-2">
        <PlusIcon className="h-5 w-5" />
        {label && <span>{label}</span>}
      </div>
    </Button>
  );
}