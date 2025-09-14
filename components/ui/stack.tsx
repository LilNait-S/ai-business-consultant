import { cn } from "@/lib/utils"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Stack: React.FC<Props> = ({ children, className }) => {
  return <div className={cn("flex flex-col", className)}>{children}</div>
}
