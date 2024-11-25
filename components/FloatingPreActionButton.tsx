// FloatingPreActionButton.tsx
import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import FloatingActionButton from "./FloatingActionButton";
import FloatingBettingActionButton from "./FloatingBettingActionButton";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingPreActionButtonProps {
  href: string;
  label?: string;
}

export default function FloatingPreActionButton({
  href,
  label,
}: FloatingPreActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 md:bottom-4 z-50">
      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -90 }} // y값을 -80에서 -60으로 수정
              exit={{ opacity: 0, y: 0 }}
              className="absolute right-0"
            >
              <FloatingActionButton 
                href={href} 
                label="피드 작성" 
                className="relative bottom-0"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -40 }} // y값을 -140에서 -120으로 수정
              exit={{ opacity: 0, y: 0 }}
              className="absolute right-0"
            >
              <FloatingBettingActionButton 
                href="/betting/add" 
                label="베팅 작성"
                className="relative bottom-0" 
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <Button
        isIconOnly
        color="primary"
        aria-label={label || "Toggle menu"}
        className={`rounded-full p-3 shadow-lg ${isExpanded ? "rotate-45" : ""} transition-transform duration-300`}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <PlusIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}