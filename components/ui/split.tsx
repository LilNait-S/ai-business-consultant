import { cn } from "@/lib/utils"
import * as React from "react"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Split: React.FC<Props> = ({ children, className, ...props }) => {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  )
}
