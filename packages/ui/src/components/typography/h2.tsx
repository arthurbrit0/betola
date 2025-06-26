import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const h2Variants = cva(
  "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
);

export interface H2Props
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof h2Variants> {}

const H2 = React.forwardRef<HTMLHeadingElement, H2Props>(
  ({ className, ...props }, ref) => {
    return (
      <h2 className={cn(h2Variants({ className }))} ref={ref} {...props} />
    );
  }
);
H2.displayName = "H2";

export { H2, h2Variants }; 