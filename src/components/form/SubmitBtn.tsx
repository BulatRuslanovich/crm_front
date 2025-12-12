import GradientLine from "@/components/ui/GradientLine";
import Icons from "@/components/icons";
import { cn } from "@/lib/utils";

import React from "react";
import { ClassValue } from "clsx";
interface SubmitBtnProps {
  text: string;
  className?: ClassValue;
  isLoading?: boolean;
}

export default function SubmitBtn({
  text,
  className,
  isLoading,
}: SubmitBtnProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <button
        className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
        type="submit"
        disabled={isLoading}
      >
        <span className="text-sm text-neutral-700 dark:text-neutral-300">
          {text}
        </span>
        <Icons.arrowRight className="size-6 dark:text-white text-black" />
        <GradientLine />
      </button>
    </div>
  );
}
