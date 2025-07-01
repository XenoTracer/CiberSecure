import Navigation from "@/components/Navigation";
import DashboardCard from "@/components/DashboardCard";
import CyberButton from "@/components/ui/cyber-button";
import ScanResults from "@/components/ScanResults";
import { scanningService, ScanResult } from "@/services/scanningService";
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
  Target,
  Terminal,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const [showScanResults, setShowScanResults] = useState(false);
  const [activeScans, setActiveScans] = useState<ScanResult[]>([]);
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    activeThreats: 3,
    systemsProtected: 847,
    redTeamTests: 24,
    securityScore: 94,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        // Start real-time scanning
        const scanId = await scanningService.startScan(searchQuery);
        setShowScanResults(true);

        // Simulate real-time threat updates
        setTimeout(() => {
          setRealtimeMetrics((prev) => ({
            ...prev,
            activeThreats: prev.activeThreats + Math.floor(Math.random() * 3),
          }));
          setNotifications((prev) => prev + 1);
        }, 3000);
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

  // Real-time updates and scan monitoring
  useEffect(() => {
    // Subscribe to scan updates
    const unsubscribe = scanningService.onScanUpdate((scan) => {
      setActiveScans((prev) => {
        const index = prev.findIndex((s) => s.id === scan.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = scan;
          return updated;
        }
        return [...prev, scan];
      });

      // Update metrics based on scan results
      if (scan.status === "completed" && scan.results.vulnerabilities) {
        const criticalVulns = scan.results.vulnerabilities.filter(
          (v) => v.severity === "critical",
        ).length;
        setRealtimeMetrics((prev) => ({
          ...prev,
          activeThreats: prev.activeThreats + criticalVulns,
        }));
        setNotifications((prev) => prev + criticalVulns);
      }
    });

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Simulate metric fluctuations
      setRealtimeMetrics((prev) => ({
        ...prev,
        systemsProtected:
          prev.systemsProtected + Math.floor(Math.random() * 5 - 2),
        securityScore: Math.max(
          85,
          Math.min(99, prev.securityScore + Math.floor(Math.random() * 3 - 1)),
        ),
      }));
    }, 30000);

    // Load existing scans
    setActiveScans(scanningService.getAllScans());

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const metrics = [
    {
      title: "Active Threats",
      value: realtimeMetrics.activeThreats.toString(),
      trend: realtimeMetrics.activeThreats > 5 ? "+25%" : "+12%",
      isAlert: realtimeMetrics.activeThreats > 5,
      icon: <AlertTriangle className="h-5 w-5" />,
      onClick: () => setShowScanResults(true),
    },
    {
      title: "Systems Protected",
      value: realtimeMetrics.systemsProtected.toString(),
      trend: "+2%",
      isAlert: false,
      icon: <Shield className="h-5 w-5" />,
      onClick: () => alert("View Protected Systems"),
    },
    {
      title: "Active Scans",
      value: activeScans
        .filter((s) => s.status === "scanning")
        .length.toString(),
      trend: activeScans.length > 0 ? "Live" : "Idle",
      isAlert: false,
      icon: <Target className="h-5 w-5" />,
      onClick: () => setShowScanResults(true),
    },
    {
      title: "Security Score",
      value: `${realtimeMetrics.securityScore}%`,
      trend:
        realtimeMetrics.securityScore > 95
          ? "+5%"
          : realtimeMetrics.securityScore < 90
            ? "-3%"
            : "+1%",
      isAlert: realtimeMetrics.securityScore < 90,
      icon: <TrendingUp className="h-5 w-5" />,
      onClick: () => alert("View Security Score Details"),
    },
  ];

  const recentActivity = [
    ...activeScans.slice(-3).map((scan) => ({
      type: "scan",
      message: `Scan ${scan.status} for ${scan.target}`,
      time:
        scan.status === "completed" && scan.endTime
          ? `${Math.round((Date.now() - scan.endTime.getTime()) / 60000)} minutes ago`
          : scan.status === "scanning"
            ? `Running (${scan.progress}%)`
            : "Just started",
      status:
        scan.status === "completed"
          ? "success"
          : scan.status === "failed"
            ? "critical"
            : "info",
    })),
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
  ].slice(0, 4);

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

          {/* Professional Vulnerability Scanner */}
          <div className="mb-8">
            <DashboardCard
              title="Vulnerability Scanner"
              icon={<Search className="h-5 w-5" />}
              className="bg-gradient-to-r from-cyber-card-bg/50 to-cyber-blue/5 border-cyber-blue/30"
            >
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter target: domain.com, 192.168.1.1, or https://example.com"
                      className="w-full px-4 py-3 bg-cyber-dark-bg border border-cyber-border-gray rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:border-cyber-blue/50 transition-all duration-200"
                    />
                  </div>
                  <CyberButton
                    type="submit"
                    size="lg"
                    loading={isSearching}
                    disabled={!searchQuery.trim()}
                    className="px-8"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Target className="h-5 w-5 mr-2" />
                        Start Scan
                      </>
                    )}
                  </CyberButton>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">
                    Comprehensive security assessment: ports, vulns, subdomains,
                    technologies
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>⚡ Real-time results</span>
                    <span>🔍 Deep scanning</span>
                    <span>📊 Risk analysis</span>
                  </div>
                </div>
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
            {/* Live Scanning Activity */}
            <DashboardCard
              title="Live Scanning Activity"
              icon={<Terminal className="h-5 w-5" />}
              clickable
              onClick={() => setShowScanResults(true)}
            >
              {activeScans.length > 0 ? (
                <div className="space-y-3">
                  {activeScans.slice(0, 3).map((scan) => (
                    <div
                      key={scan.id}
                      className="flex items-center justify-between p-3 bg-cyber-dark-bg/50 rounded"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">
                          {scan.target}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {scan.status === "scanning"
                            ? `${scan.progress}% complete`
                            : scan.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {scan.status === "scanning" && (
                          <div className="w-2 h-2 bg-cyber-blue rounded-full animate-pulse" />
                        )}
                        {getStatusIcon(scan.status)}
                      </div>
                    </div>
                  ))}
                  <CyberButton
                    size="sm"
                    className="w-full"
                    onClick={() => setShowScanResults(true)}
                  >
                    View All Scans
                  </CyberButton>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No active scans</p>
                  <p className="text-xs">Start a scan to monitor progress</p>
                </div>
              )}
            </DashboardCard>
          </div>
        </div>
      </main>

      {/* Scan Results Modal */}
      {showScanResults && (
        <ScanResults onClose={() => setShowScanResults(false)} />
      )}
    </div>
  );
}
