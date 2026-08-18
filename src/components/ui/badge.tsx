import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-50 text-emerald-800 border border-emerald-200/80",
        secondary:
          "bg-amber-50 text-amber-800 border border-amber-200/80",
        destructive:
          "bg-red-50 text-red-700 border border-red-200/80",
        outline:
          "border border-slate-200 text-slate-700 bg-white",
        success:
          "bg-emerald-600 text-white shadow-sm",
        warning:
          "bg-amber-500 text-white shadow-sm",
        wholesale:
          "bg-emerald-600 text-white font-black shadow-sm",
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
