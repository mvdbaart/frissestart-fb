import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface SectionContainerProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements; // Allow specifying the element type, defaults to 'section'
}

export function SectionContainer({
  children,
  className,
  as: Component = "section",
  ...props
}: SectionContainerProps) {
  return (
    <Component
      className={cn("py-12 md:py-16 lg:py-20", className)}
      {...props}
    >
      <div className="container mx-auto px-4">{children}</div>
    </Component>
  );
}
