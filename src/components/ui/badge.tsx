import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", {
  variants: {
    variant: {
      brand: "bg-brand-100 text-brand-800",
      neutral: "bg-neutral-100 text-neutral-600",
      success: "bg-success-50 text-success-700",
      warning: "bg-warning-50 text-warning-700",
      error: "bg-error-50 text-error-700",
    },
  },
  defaultVariants: { variant: "neutral" },
});

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
