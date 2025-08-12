import React from "react";

import { cn } from "@/lib/utils";

type ContainerProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

const Container = React.forwardRef(
  <T extends React.ElementType = "div">(
    { as, className, children, ...props }: ContainerProps<T>,
    ref: React.Ref<never>,
  ) => {
    const Component = as || "div";
    return (
      <Component
        ref={ref}
        className={cn("px-[18px] max-w-[402px] w-full ", className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Container.displayName = "Container";
export default Container;
