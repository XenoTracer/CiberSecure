import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  AlertTriangle,
  Settings,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navigationItems = [
  {
    name: "Dashboard Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Red Team Activity",
    href: "/red-team",
    icon: Target,
  },
  {
    name: "Risk Analysis",
    href: "/risk-analysis",
    icon: AlertTriangle,
  },
  {
    name: "Security Settings",
    href: "/security-settings",
    icon: Settings,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
  },
];

export default function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-cyber-dark-bg border-r border-cyber-border-gray px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-cyber-blue">
              Cyber Secure Dashboard
            </h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={cn(
                            isActive
                              ? "bg-cyber-blue text-cyber-dark-bg"
                              : "text-foreground hover:text-cyber-blue hover:bg-cyber-card-bg",
                            "group flex gap-x-3 rounded-md p-4 text-sm leading-6 font-medium transition-colors",
                          )}
                        >
                          <Icon
                            className="h-5 w-5 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-cyber-dark-bg border-b border-cyber-border-gray px-4 py-4 shadow-sm lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-foreground lg:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-cyber-blue">
            Cyber Secure Dashboard
          </h1>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="relative z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  className="-m-2.5 p-2.5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-cyber-dark-bg px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <h1 className="text-lg font-bold text-cyber-blue">
                    Cyber Secure Dashboard
                  </h1>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigationItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.href;
                          return (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                  isActive
                                    ? "bg-cyber-blue text-cyber-dark-bg"
                                    : "text-foreground hover:text-cyber-blue hover:bg-cyber-card-bg",
                                  "group flex gap-x-3 rounded-md p-4 text-sm leading-6 font-medium transition-colors",
                                )}
                              >
                                <Icon
                                  className="h-5 w-5 shrink-0"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
