import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-100 text-emerald-800 border border-emerald-200",
        secondary:
          "bg-amber-100 text-amber-800 border border-amber-200",
        destructive:
          "bg-red-100 text-red-700 border border-red-200",
        outline:
          "border border-input bg-background text-foreground",
        success:
          "bg-emerald-500 text-white",
        warning:
          "bg-amber-400 text-amber-900",
        wholesale:
          "bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
