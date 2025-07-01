import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export default function DashboardCard({
  title,
  children,
  className,
  icon,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "bg-cyber-card-bg border border-cyber-border-gray rounded-lg p-6 backdrop-blur-sm",
        "hover:border-cyber-blue/50 transition-colors duration-200",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && <div className="text-cyber-blue">{icon}</div>}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}
