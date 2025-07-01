import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-dark-bg disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-cyber-blue text-cyber-dark-bg hover:bg-cyber-blue/90 focus:ring-cyber-blue shadow-lg hover:shadow-cyber-blue/25",
        destructive:
          "bg-cyber-red text-white hover:bg-cyber-red/90 focus:ring-cyber-red shadow-lg hover:shadow-cyber-red/25",
        outline:
          "border border-cyber-border-gray bg-transparent text-foreground hover:bg-cyber-card-bg hover:border-cyber-blue focus:ring-cyber-blue",
        secondary:
          "bg-cyber-card-bg text-foreground hover:bg-cyber-card-bg/80 border border-cyber-border-gray hover:border-cyber-blue focus:ring-cyber-blue",
        ghost:
          "text-foreground hover:bg-cyber-card-bg hover:text-cyber-blue focus:ring-cyber-blue",
        link: "text-cyber-blue underline-offset-4 hover:underline focus:ring-cyber-blue",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-8",
        xl: "h-12 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  loading?: boolean;
}

export default function CyberButton({
  className,
  variant,
  size,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
