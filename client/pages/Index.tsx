import Navigation from "@/components/Navigation";
import DashboardCard from "@/components/DashboardCard";
import CyberButton from "@/components/ui/cyber-button";
import {
  Shield,
  Activity,
  AlertTriangle,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Download,
  Bell,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [notifications, setNotifications] = useState(3);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Searching for:", searchQuery);
        // You would implement actual search functionality here
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate data refresh
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLastUpdated(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };

  const clearNotifications = () => {
    setNotifications(0);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      title: "Active Threats",
      value: "3",
      trend: "+12%",
      isAlert: true,
      icon: <AlertTriangle className="h-5 w-5" />,
      onClick: () => alert("View Active Threats Details"),
    },
    {
      title: "Systems Protected",
      value: "847",
      trend: "+2%",
      isAlert: false,
      icon: <Shield className="h-5 w-5" />,
      onClick: () => alert("View Protected Systems"),
    },
    {
      title: "Red Team Tests",
      value: "24",
      trend: "-8%",
      isAlert: false,
      icon: <Activity className="h-5 w-5" />,
      onClick: () => alert("View Red Team Test Results"),
    },
    {
      title: "Security Score",
      value: "94%",
      trend: "+5%",
      isAlert: false,
      icon: <TrendingUp className="h-5 w-5" />,
      onClick: () => alert("View Security Score Details"),
    },
  ];

  const recentActivity = [
    {
      type: "alert",
      message: "High-priority vulnerability detected in web server",
      time: "2 minutes ago",
      status: "critical",
    },
    {
      type: "success",
      message: "Red team penetration test completed successfully",
      time: "15 minutes ago",
      status: "success",
    },
    {
      type: "info",
      message: "Security patch applied to database cluster",
      time: "1 hour ago",
      status: "info",
    },
    {
      type: "alert",
      message: "Unusual network traffic pattern detected",
      time: "2 hours ago",
      status: "warning",
    },
  ];

  const getActivityIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <XCircle className="h-5 w-5 text-cyber-red" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-cyber-blue" />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark-bg">
      <Navigation />

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="px-4 py-8 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Dashboard Overview
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Real-time security monitoring and threat assessment
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <CyberButton
                    variant="outline"
                    size="icon"
                    onClick={clearNotifications}
                    className="relative"
                  >
                    <Bell className="h-4 w-4" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-cyber-red text-xs text-white rounded-full flex items-center justify-center animate-pulse">
                        {notifications}
                      </span>
                    )}
                  </CyberButton>
                </div>
                <CyberButton
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  loading={isRefreshing}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </CyberButton>
                <CyberButton variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </CyberButton>
              </div>
            </div>
          </div>

          {/* URI/IP Search Bar for Bug Bounty Hunters */}
          <div className="mb-8">
            <DashboardCard
              title="Target Search"
              icon={<Search className="h-5 w-5" />}
              className="bg-cyber-card-bg/50"
            >
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter URI, IP address, or domain (e.g., example.com, 192.168.1.1)"
                      className="w-full px-4 py-3 bg-cyber-dark-bg border border-cyber-border-gray rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:border-transparent transition-colors"
                    />
                  </div>
                  <CyberButton
                    type="submit"
                    size="lg"
                    loading={isSearching}
                    disabled={!searchQuery.trim()}
                  >
                    <Search className="h-5 w-5" />
                  </CyberButton>
                </div>
                <p className="text-sm text-muted-foreground">
                  Search for targets, perform reconnaissance, and analyze
                  security posture
                </p>
              </form>
            </DashboardCard>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {metrics.map((metric) => (
              <DashboardCard
                key={metric.title}
                title={metric.title}
                icon={metric.icon}
                className="text-center group"
                clickable
                onClick={metric.onClick}
                loading={isRefreshing}
              >
                <div className="space-y-2">
                  <div
                    className={`text-3xl font-bold transition-all duration-200 ${
                      metric.isAlert ? "text-cyber-red" : "text-cyber-blue"
                    } group-hover:scale-110`}
                  >
                    {metric.value}
                  </div>
                  <div
                    className={`text-sm ${
                      metric.trend.startsWith("+")
                        ? "text-green-500"
                        : "text-cyber-red"
                    }`}
                  >
                    {metric.trend} from last week
                  </div>
                </div>
              </DashboardCard>
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Status */}
            <DashboardCard
              title="System Status"
              icon={<Shield className="h-5 w-5" />}
              clickable
              onClick={() => alert("Opening System Status Details")}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Firewall Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-500">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Intrusion Detection</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-500">Monitoring</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Endpoint Protection</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-500">Updating</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Network Scan</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyber-red rounded-full"></div>
                    <span className="text-cyber-red">Alert</span>
                  </div>
                </div>
              </div>
            </DashboardCard>

            {/* Recent Activity */}
            <DashboardCard
              title="Recent Activity"
              icon={<Activity className="h-5 w-5" />}
              clickable
              onClick={() => alert("View All Activity Logs")}
            >
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-cyber-dark-bg/50 hover:bg-cyber-dark-bg/70 transition-colors cursor-pointer"
                    onClick={() =>
                      alert(`Activity Details: ${activity.message}`)
                    }
                  >
                    {getActivityIcon(activity.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground hover:text-cyber-blue transition-colors">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
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
                  </div>
                ))}
              </div>
            </DashboardCard>

            {/* Risk Assessment */}
            <DashboardCard
              title="Risk Assessment"
              icon={<AlertTriangle className="h-5 w-5" />}
              clickable
              onClick={() => alert("Opening Risk Analysis Dashboard")}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Critical Vulnerabilities</span>
                  <span className="text-cyber-red font-semibold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>High Risk Issues</span>
                  <span className="text-yellow-500 font-semibold">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Medium Risk Issues</span>
                  <span className="text-cyber-blue font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Low Risk Issues</span>
                  <span className="text-green-500 font-semibold">28</span>
                </div>
                <div className="mt-4 pt-4 border-t border-cyber-border-gray">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyber-red">
                      High Risk
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Overall Risk Level
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>

            {/* Team Performance */}
            <DashboardCard
              title="Team Performance"
              icon={<Users className="h-5 w-5" />}
              clickable
              onClick={() => alert("View Team Performance Analytics")}
            >
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-cyber-blue">94%</div>
                  <div className="text-sm text-muted-foreground">
                    Security Efficiency
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Response Time</span>
                    <span className="text-green-500">2.3 min avg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Incidents Resolved</span>
                    <span className="text-cyber-blue">47/50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Analysts</span>
                    <span className="text-foreground">8/12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="text-green-500">96.2%</span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
    </div>
  );
}
