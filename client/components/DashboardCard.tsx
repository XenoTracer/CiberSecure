import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  onClick?: () => void;
  clickable?: boolean;
  loading?: boolean;
}

export default function DashboardCard({
  title,
  children,
  className,
  icon,
  onClick,
  clickable = false,
  loading = false,
}: DashboardCardProps) {
  const isInteractive = clickable || onClick;

  return (
    <div
      className={cn(
        "bg-cyber-card-bg border border-cyber-border-gray rounded-lg p-6 backdrop-blur-sm",
        "hover:border-cyber-blue/50 transition-all duration-200 relative overflow-hidden",
        isInteractive &&
          "cursor-pointer hover:bg-cyber-card-bg/80 hover:shadow-lg hover:shadow-cyber-blue/10 hover:scale-[1.02] active:scale-[0.98]",
        loading && "opacity-70",
        className,
      )}
      onClick={onClick}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {loading && (
        <div className="absolute inset-0 bg-cyber-dark-bg/20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-cyber-blue border-t-transparent"></div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <div
            className={cn(
              "text-cyber-blue transition-colors duration-200",
              isInteractive && "group-hover:text-cyber-blue/80",
            )}
          >
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {isInteractive && (
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <svg
              className="h-4 w-4 text-cyber-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}
