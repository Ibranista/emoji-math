import React from "react";

import { cn } from "@/lib/utils";
import { motion, MotionProps } from "framer-motion";

type ContainerProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

const Container = React.forwardRef(
  <T extends React.ElementType = "div">(
    { as, className, children, ...props }: ContainerProps<T>,
    ref: React.Ref<never>
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
  }
);

Container.displayName = "Container";
export default Container;

export const PlayContainer = React.forwardRef(
  <T extends React.ElementType = "div">(
    { as, className, children, ...props }: ContainerProps<T>,
    ref: React.Ref<never>
  ) => {
    const Component = as || "article";
    return (
      <Component
        ref={ref}
        className={cn(
          "relative px-[27px] !max-w-none !w-[366px] flex justify-center items-start flex-col gap-y-6",
          className
        )}
        style={{
          backgroundImage: "url('/click-start-bg.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "366px",
          height: "352px",
        }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

// play items wrapper that accepts a key and it should be motion.div
type PlayItemsWrapperProps<T extends React.ElementType> = ContainerProps<T> &
  MotionProps;

export const PlayItemsWrapper = React.forwardRef(
  <T extends React.ElementType = "div">(
    { as, className, children, ...props }: PlayItemsWrapperProps<T>,
    ref: React.Ref<never>
  ) => {
    const { idx = 0 } = props as { idx?: number };
    const Component = as || motion.div;
    return (
      <Component
        ref={ref}
        className={cn(className)}
        {...props}
        initial={{
          opacity: 0,
          y: 10,
          filter: "blur(8px) brightness(0.95)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "none",
          transition: {
            opacity: { delay: 0.2 + idx * 0.13, duration: 0.45 },
            y: {
              delay: 0.2 + idx * 0.13,
              type: "spring",
              stiffness: 350,
              damping: 22,
            },
            filter: { delay: 0.2 + idx * 0.13, duration: 0.4 },
          },
        }}
      >
        {children}
      </Component>
    );
  }
);
