import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const h1Variants = cva(
  "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
);

export interface H1Props
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof h1Variants> {}

const H1 = React.forwardRef<HTMLHeadingElement, H1Props>(
  ({ className, ...props }, ref) => {
    return (
      <h1 className={cn(h1Variants({ className }))} ref={ref} {...props} />
    );
  }
);
H1.displayName = "H1";

export { H1, h1Variants }; 