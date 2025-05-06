import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#F62D40] dark:focus:ring-[#F8888F] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#F62D40] dark:bg-[#F8888F] text-white dark:text-gray-900 shadow hover:bg-[#E02A3B] dark:hover:bg-[#F9A2A7]",
        secondary:
          "border-transparent bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600",
        destructive:
          "border-transparent bg-red-500 text-white shadow hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
        outline: "border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
