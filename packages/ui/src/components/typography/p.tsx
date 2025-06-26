import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pVariants = cva("leading-7 [&:not(:first-child)]:mt-6");

export interface PProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof pVariants> {}

const P = React.forwardRef<HTMLParagraphElement, PProps>(
  ({ className, ...props }, ref) => {
    return <p className={cn(pVariants({ className }))} ref={ref} {...props} />;
  }
);
P.displayName = "P";

export { P, pVariants }; 