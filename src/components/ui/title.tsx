import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Title = ({
  children,
  className,
  ...props
}: Props & React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h1 className={cn("text-3xl font-semibold", className)} {...props}>
      {children}
    </h1>
  );
};

export default Title;
