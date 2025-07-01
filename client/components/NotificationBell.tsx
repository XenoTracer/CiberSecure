import { useState, useEffect, useRef } from "react";
import {
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";
import { cveService, NotificationItem } from "@/services/cveService";
import CyberButton from "./ui/cyber-button";
import { cn } from "@/lib/utils";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subscribe to notification updates
    const unsubscribe = cveService.onNotificationUpdate((newNotifications) => {
      setNotifications(newNotifications);
      setUnreadCount(cveService.getUnreadCount());
    });

    // Load initial notifications
    setNotifications(cveService.getNotifications());
    setUnreadCount(cveService.getUnreadCount());

    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // Mark all as read when opening
      setTimeout(() => {
        cveService.markAllAsRead();
      }, 1000);
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    cveService.markAsRead(notification.id);
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handleClearAll = () => {
    cveService.clearAllNotifications();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-cyber-red" />;
      default:
        return <Info className="h-4 w-4 text-cyber-blue" />;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <CyberButton
        variant="outline"
        size="icon"
        onClick={handleBellClick}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-cyber-red text-xs text-white rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </CyberButton>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-cyber-dark-bg border border-cyber-border-gray rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-cyber-border-gray">
            <h3 className="text-lg font-semibold text-foreground">
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <CyberButton
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs"
                >
                  Clear All
                </CyberButton>
              )}
              <CyberButton
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-3 w-3" />
              </CyberButton>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p>No notifications yet</p>
                <p className="text-xs mt-1">Start a scan to receive updates</p>
              </div>
            ) : (
              <div className="divide-y divide-cyber-border-gray">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-cyber-card-bg/30 transition-colors cursor-pointer",
                      !notification.read &&
                        "bg-cyber-blue/5 border-l-2 border-l-cyber-blue",
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4
                            className={cn(
                              "text-sm font-medium text-foreground truncate",
                              !notification.read && "font-semibold",
                            )}
                          >
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>

                        {notification.metadata && (
                          <div className="mt-2 flex items-center gap-2">
                            {notification.metadata.cveId && (
                              <span className="text-xs bg-cyber-blue/20 text-cyber-blue px-2 py-1 rounded">
                                {notification.metadata.cveId}
                              </span>
                            )}
                            {notification.metadata.severity && (
                              <span
                                className={cn(
                                  "text-xs px-2 py-1 rounded",
                                  notification.metadata.severity === "CRITICAL"
                                    ? "bg-cyber-red/20 text-cyber-red"
                                    : notification.metadata.severity === "HIGH"
                                      ? "bg-red-500/20 text-red-500"
                                      : "bg-yellow-500/20 text-yellow-500",
                                )}
                              >
                                {notification.metadata.severity}
                              </span>
                            )}
                            {notification.metadata.count && (
                              <span className="text-xs text-muted-foreground">
                                {notification.metadata.count} items
                              </span>
                            )}
                          </div>
                        )}

                        {!notification.read && (
                          <div className="absolute top-4 right-4 w-2 h-2 bg-cyber-blue rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-cyber-border-gray">
              <CyberButton
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  // Could navigate to a full notifications page
                  setIsOpen(false);
                }}
              >
                View All Notifications
              </CyberButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
