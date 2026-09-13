import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-site px-5 md:px-[50px] ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}
