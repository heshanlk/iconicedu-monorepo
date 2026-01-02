import * as React from "react"

import { cn } from "@iconicedu/ui-web/lib/utils"

function Item({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item"
      className={cn(
        "border-border bg-card text-card-foreground flex items-center gap-3 rounded-2xl border px-4 py-3",
        className
      )}
      {...props}
    />
  )
}

function ItemIcon({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="item-icon"
      className={cn(
        "bg-muted text-muted-foreground flex h-9 w-9 items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

function ItemContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex-1 text-sm font-medium", className)}
      {...props}
    />
  )
}

function ItemAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-action"
      className={cn("text-muted-foreground ml-auto", className)}
      {...props}
    />
  )
}

export { Item, ItemAction, ItemContent, ItemIcon }
