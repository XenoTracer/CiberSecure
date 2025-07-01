import Navigation from "@/components/Navigation";
import DashboardCard from "@/components/DashboardCard";
import {
  Shield,
  Activity,
  AlertTriangle,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function Index() {
  const metrics = [
    {
      title: "Active Threats",
      value: "3",
      trend: "+12%",
      isAlert: true,
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      title: "Systems Protected",
      value: "847",
      trend: "+2%",
      isAlert: false,
      icon: <Shield className="h-5 w-5" />,
    },
    {
      title: "Red Team Tests",
      value: "24",
      trend: "-8%",
      isAlert: false,
      icon: <Activity className="h-5 w-5" />,
    },
    {
      title: "Security Score",
      value: "94%",
      trend: "+5%",
      isAlert: false,
      icon: <TrendingUp className="h-5 w-5" />,
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
            <h1 className="text-3xl font-bold text-foreground">
              Dashboard Overview
            </h1>
            <p className="mt-2 text-muted-foreground">
              Real-time security monitoring and threat assessment
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {metrics.map((metric) => (
              <DashboardCard
                key={metric.title}
                title={metric.title}
                icon={metric.icon}
                className="text-center"
              >
                <div className="space-y-2">
                  <div
                    className={`text-3xl font-bold ${
                      metric.isAlert ? "text-cyber-red" : "text-cyber-blue"
                    }`}
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
            >
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-cyber-dark-bg/50"
                  >
                    {getActivityIcon(activity.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>

            {/* Risk Assessment */}
            <DashboardCard
              title="Risk Assessment"
              icon={<AlertTriangle className="h-5 w-5" />}
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
