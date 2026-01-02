"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@iconicedu/ui-web/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 data-checked:bg-primary dark:data-checked:bg-primary data-checked:border-primary focus-visible:ring-[3px] focus-visible:outline-none bg-input/50 border-input inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="bg-background data-checked:translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full shadow transition-transform"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
